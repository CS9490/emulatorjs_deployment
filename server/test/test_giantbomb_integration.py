import requests

def test_giantbomb_api_integration():
    API_KEY = "b6ea6721c015a9b5e39764279ff22a4c18802e3d"  # Hardcoded API key
    headers = {'User-Agent': 'MCIRetroVault/1.0'}
    response = requests.get(
        'https://www.giantbomb.com/api/games/',
        headers=headers,
        params={
            'api_key': API_KEY,
            'filter': 'name:Mario',  
            'format': 'json',
            'field_list': 'name,id'
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert 'results' in data
    assert len(data['results']) > 0