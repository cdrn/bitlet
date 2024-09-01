use super::*;
use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use testcontainers::{clients::Cli, images::redis::Redis, Docker, RunArgs};
use tokio::sync::Mutex;
use warp::test::request;
use warp::Filter;

#[tokio::test]
async fn test_shorten_and_resolve() {
    dotenv::dotenv().ok();
    let redis_url = env::var("REDIS_URL").expect("REDIS_URL must be set");
    let client = redis::Client::open(redis_url.clone()).expect("Failed to create Redis client");
    let redis_conn = client
        .get_async_connection()
        .await
        .expect("Failed to connect to Redis");
    let redis_conn = Arc::new(Mutex::new(redis_conn));

    let params = HashMap::from([("url".to_string(), "https://example.com".to_string())]);

    // Test the shorten endpoint
    let shorten_filter = warp::path("shorten")
        .and(warp::query::<HashMap<String, String>>())
        .and(with_redis(redis_conn.clone()))
        .and_then(handle_shorten);

    let res = request()
        .method("GET")
        .path("/shorten?url=https://example.com")
        .reply(&shorten_filter)
        .await;

    assert_eq!(res.status(), 200);
    let shortened_url = std::str::from_utf8(res.body()).unwrap();
    assert!(shortened_url.contains("Shortened URL"));

    // Extract the shortened URL from the response
    let shortened_url = shortened_url
        .split("Shortened URL: ")
        .nth(1)
        .unwrap()
        .trim();

    // Test the resolve endpoint
    let resolve_filter = warp::path!("resolve" / String)
        .and(with_redis(redis_conn.clone()))
        .and_then(handle_resolve);

    let res = request()
        .method("GET")
        .path(&format!("/resolve/{}", shortened_url))
        .reply(&resolve_filter)
        .await;

    assert_eq!(res.status(), 200);
    assert_eq!(res.body(), "Original URL: https://example.com");
}
