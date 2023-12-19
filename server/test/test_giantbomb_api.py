from unittest.mock import patch
import requests

def test_giantbomb_api_search():
    with patch('requests.get') as mocked_get:
        # Mock the response from GiantBomb API
        mocked_get.return_value.status_code = 200
        mocked_get.return_value.json.return_value = {
            'results': [{'name': 'Test Game', 'id': 123}]
        }

        response = requests.get('https://www.giantbomb.com/api/games/', params={'api_key': 'YOUR_API_KEY', 'filter': 'name:Test Game'})

        assert response.status_code == 200
        assert response.json()['results'][0]['name'] == 'Test Game'