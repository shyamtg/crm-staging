import requests
from serlist import SerpScraper

def searcher(url):
    keyword = "shyamsundar.tg@gmail.com"
    header = {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36', }
    #result = requests.get("https://www.google.com/search?&q=" + keyword ,
    #                        headers=header)
    result = requests.get(url,
                          headers=header)
    social_links = []
    data = SerpScraper().scrape(str(result.content))
    for item in data:
        if "twitter" in item["link"] or "facebook" in item["link"] or "instagram" in item["link"] or "linkedin" in item["link"]:
            social_links.append(item)

    return social_links

