import concurrent.futures
import urllib.request
from pathlib import Path

ASSETS = {
    'hero': 'photo-1539109136881-3be0616acf4b', 'editorial': 'photo-1483985988355-763728e1935b',
    'blazer': 'photo-1591047139829-d91aecb6caea', 'blazer-detail': 'photo-1548624149-f3221f43c381',
    'shirt': 'photo-1598033129183-c4f50c736f10', 'shirt-detail': 'photo-1603252109303-2751441dd157',
    'bag': 'photo-1548036328-c9fa89d128fa', 'bag-detail': 'photo-1584917865442-de89df76afd3',
    'sneaker': 'photo-1549298916-b41d501d3772', 'sneaker-detail': 'photo-1600269452121-4f2416e55c28',
    'knit': 'photo-1434389677669-e08b4cac3105', 'knit-detail': 'photo-1576566588028-4147f3842f27',
    'coat': 'photo-1548624149-f3221f43c381', 'coat-detail': 'photo-1539533018447-63fcce2678e3',
    'trousers': 'photo-1473966968600-fa801b869a1a', 'trousers-detail': 'photo-1624378439575-d8705ad7ae80',
    'scarf': 'photo-1601924994987-69e26d50dc26', 'scarf-detail': 'photo-1601924994987-69e26d50dc26',
    'category-women': 'photo-1483985988355-763728e1935b', 'category-men': 'photo-1617137968427-85924c800a22',
}

def download(pair):
    name, image_id = pair
    width = 1600 if name in ('hero', 'editorial') else 800
    url = f'https://images.unsplash.com/{image_id}?auto=format&fit=crop&w={width}&q=85'
    data = urllib.request.urlopen(url, timeout=60).read()
    Path(f'public/images/{name}.jpg').write_bytes(data)
    return f'{name}: {len(data)} bytes'

if __name__ == '__main__':
    Path('public/images').mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(download, ASSETS.items()):
            print(result)
