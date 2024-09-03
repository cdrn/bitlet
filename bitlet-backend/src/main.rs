use log::{info, warn};
use md5::compute;
use redis::AsyncCommands;
use serde::Serialize;
use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use warp::cors::Cors;
use warp::http::Method;
use warp::{any, path, query, reply::json, Filter, Rejection, Reply};

#[derive(Serialize)]
struct UrlResponse {
    message: String,
}

#[derive(Serialize)]
struct UrlListResponse {
    urls: HashMap<String, String>,
}

pub async fn handle_shorten(
    params: HashMap<String, String>,
    redis_conn: Arc<Mutex<redis::aio::Connection>>,
) -> Result<impl Reply, Rejection> {
    let mut redis_conn = redis_conn.lock().await;
    if let Some(url) = params.get("url") {
        let shortened_url = format!("{:x}", compute(url));
        let _: () = redis_conn
            .set(shortened_url.clone(), url.to_string())
            .await
            .expect("Could not connect to redis");
        info!("Shortened URL: {} -> {}", url, shortened_url);
        Ok(json(&UrlResponse {
            message: format!("Shortened URL: {}", shortened_url),
        }))
    } else {
        warn!("Missing URL parameter");
        Ok(json(&UrlResponse {
            message: "Missing URL parameter".to_string(),
        }))
    }
}

pub async fn handle_resolve(
    shortened_url: String,
    redis_conn: Arc<Mutex<redis::aio::Connection>>,
) -> Result<impl Reply, Rejection> {
    let mut redis_conn = redis_conn.lock().await;
    let original_url: Option<String> = redis_conn.get(&shortened_url).await.unwrap();
    if let Some(url) = original_url {
        info!("Resolved URL: {} -> {}", shortened_url, url);
        Ok(json(&UrlResponse {
            message: format!("Original URL: {}", url),
        }))
    } else {
        warn!("URL not found: {}", shortened_url);
        Ok(json(&UrlResponse {
            message: "URL not found".to_string(),
        }))
    }
}

pub async fn handle_list(
    redis_conn: Arc<Mutex<redis::aio::Connection>>,
) -> Result<impl Reply, Rejection> {
    let mut redis_conn = redis_conn.lock().await;
    let keys: Vec<String> = redis_conn.keys("*").await.unwrap();
    let mut urls = HashMap::new();
    for key in keys {
        if let Ok(url) = redis_conn.get::<String, String>(key.clone()).await {
            urls.insert(key, url);
        }
    }
    Ok(json(&UrlListResponse { urls }))
}

fn with_redis(
    redis_conn: Arc<Mutex<redis::aio::Connection>>,
) -> impl Filter<Extract = (Arc<Mutex<redis::aio::Connection>>,), Error = std::convert::Infallible> + Clone
{
    any().map(move || redis_conn.clone())
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let redis_url = env::var("REDIS_URL").expect("REDIS_URL must be set");
    let client = redis::Client::open(redis_url).unwrap();
    let redis_conn = client.get_async_connection().await.unwrap();
    let redis_conn = Arc::new(Mutex::new(redis_conn));

    let shorten_filter = warp::path("shorten")
        .and(warp::query::<HashMap<String, String>>())
        .and(with_redis(redis_conn.clone()))
        .and_then(handle_shorten);

    let resolve_filter = warp::path!("resolve" / String)
        .and(with_redis(redis_conn.clone()))
        .and_then(handle_resolve);

    let list_filter = warp::path("list")
        .and(with_redis(redis_conn.clone()))
        .and_then(handle_list);

    let routes = shorten_filter.or(resolve_filter).or(list_filter);

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST]);

    let routes = routes.with(cors);

    let port = 3030;

    info!("bitlet-backend started! Listening on port: {}", port);
    warp::serve(routes).run(([0, 0, 0, 0], port)).await;
}

#[cfg(test)]
mod tests;
