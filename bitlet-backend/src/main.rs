use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use warp::Filter;

type UrlMap = Arc<Mutex<HashMap<String, String>>>;

fn shorten(
    url_map: UrlMap,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    warp::path("shorten")
        .and(warp::query::<HashMap<String, String>>())
        .and(warp::any().map(move || Arc::clone(&url_map)))
        .map(|params: HashMap<String, String>, url_map: UrlMap| {
            if let Some(url) = params.get("url") {
                let shortened_url = format!("{:x}", md5::compute(url));
                let mut map = url_map.lock().unwrap();
                map.insert(shortened_url.clone(), url.to_string());
                log::info!("Shortened URL: {} -> {}", url, shortened_url);
                warp::reply::html(format!("Shortened URL: {}", shortened_url))
            } else {
                log::warn!("Missing URL parameter");
                warp::reply::html("Missing URL parameter".to_string())
            }
        })
}

fn resolve(
    url_map: UrlMap,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    warp::path!("resolve" / String)
        .and(warp::any().map(move || Arc::clone(&url_map)))
        .map(|shortened_url: String, url_map: UrlMap| {
            let map = url_map.lock().unwrap();
            if let Some(original_url) = map.get(&shortened_url) {
                log::info!("Resolved URL: {} -> {}", shortened_url, original_url);
                warp::reply::html(format!("Original URL: {}", original_url))
            } else {
                log::warn!("URL not found: {}", shortened_url);
                warp::reply::html("URL not found".to_string())
            }
        })
}

#[tokio::main]
async fn main() {
    let url_map: UrlMap = Arc::new(Mutex::new(HashMap::new()));

    let routes = shorten(Arc::clone(&url_map)).or(resolve(Arc::clone(&url_map)));

    let port = 3030;

    log::info!("bitlet-backend started! Listening on port: {}", port);
    warp::serve(routes).run(([127, 0, 0, 1], port)).await;
}

#[cfg(test)]
mod tests;
