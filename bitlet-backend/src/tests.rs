use super::*;
use warp::test::request;

#[tokio::test]
async fn test_shorten_and_resolve() {
    let url_map: UrlMap = Arc::new(Mutex::new(HashMap::new()));

    // Test shortening
    let resp = request()
        .method("GET")
        .path("/shorten?url=https://www.example.com")
        .reply(&shorten(Arc::clone(&url_map)))
        .await;

    assert_eq!(resp.status(), 200, "Shorten request failed: {:?}", resp);
    let body = String::from_utf8(resp.body().to_vec()).unwrap();
    assert!(
        body.starts_with("Shortened URL: "),
        "Unexpected response: {}",
        body
    );

    // Extract the shortened URL
    let shortened_url = body.split_whitespace().last().unwrap().to_string();

    // Test resolving
    let resp = request()
        .method("GET")
        .path(&format!("/resolve/{}", shortened_url))
        .reply(&resolve(Arc::clone(&url_map)))
        .await;

    assert_eq!(resp.status(), 200, "Resolve request failed: {:?}", resp);
    let body = String::from_utf8(resp.body().to_vec()).unwrap();
    assert_eq!(
        body, "Original URL: https://www.example.com",
        "Unexpected response: {}",
        body
    );
}
