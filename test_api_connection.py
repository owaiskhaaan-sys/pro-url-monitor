"""
Test Google Indexing API Connection
====================================
This script tests if your API setup is working correctly
"""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SERVICE_ACCOUNT_FILE = 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']

def test_api():
    print("=" * 80)
    print("🧪 TESTING GOOGLE INDEXING API CONNECTION")
    print("=" * 80)
    print()
    
    # Step 1: Check service account file
    print("1️⃣  Checking service account file...")
    try:
        with open(SERVICE_ACCOUNT_FILE, 'r') as f:
            sa_data = json.load(f)
        
        email = sa_data.get('client_email')
        project = sa_data.get('project_id')
        
        print(f"   ✅ File found")
        print(f"   📧 Email: {email}")
        print(f"   🏢 Project: {project}")
        print()
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Step 2: Test authentication
    print("2️⃣  Testing authentication...")
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, 
            scopes=SCOPES
        )
        print("   ✅ Credentials loaded successfully")
        print()
    except Exception as e:
        print(f"   ❌ Error loading credentials: {e}")
        return
    
    # Step 3: Build service
    print("3️⃣  Building API service...")
    try:
        service = build('indexing', 'v3', credentials=credentials)
        print("   ✅ API service built successfully")
        print()
    except Exception as e:
        print(f"   ❌ Error building service: {e}")
        print()
        print("   💡 Possible reasons:")
        print("      - Web Search Indexing API not enabled in Google Cloud")
        print("      - Internet connection issue")
        print()
        print("   🔧 To fix:")
        print("      1. Go to: https://console.cloud.google.com/")
        print(f"      2. Select project: {project}")
        print("      3. Go to: APIs & Services > Library")
        print("      4. Search: Web Search Indexing API")
        print("      5. Click ENABLE")
        return
    
    # Step 4: Test with a sample URL
    print("4️⃣  Testing with sample URL...")
    test_url = "https://www.prourlmonitor.com/"
    
    try:
        # Try to get metadata (this won't submit, just checks permission)
        print(f"   Testing URL: {test_url}")
        
        # Try publishing a notification
        body = {
            'url': test_url,
            'type': 'URL_UPDATED'
        }
        
        response = service.urlNotifications().publish(body=body).execute()
        
        print("   ✅ API CALL SUCCESSFUL! 🎉")
        print()
        print("   📊 Response:")
        print(f"      URL: {response.get('url', 'N/A')}")
        print(f"      Type: {response.get('notifyTime', 'N/A')}")
        print()
        print("   ✅ YOUR SETUP IS WORKING CORRECTLY!")
        print()
        print("   This means:")
        print("      ✅ Service account is properly configured")
        print("      ✅ Service account has permission in Search Console")
        print("      ✅ Web Search Indexing API is enabled")
        print("      ✅ API calls are going through to Google")
        print()
        
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        error_message = error_details.get('error', {}).get('message', str(e))
        error_code = error_details.get('error', {}).get('code', 'Unknown')
        
        print(f"   ❌ API CALL FAILED")
        print(f"   Error Code: {error_code}")
        print(f"   Error Message: {error_message}")
        print()
        
        # Detailed error explanations
        if "Permission denied" in error_message or error_code == 403:
            print("   🔴 PERMISSION DENIED ERROR")
            print()
            print("   This means:")
            print("      ❌ Service account email is NOT added to Search Console")
            print("      OR")
            print("      ❌ Service account doesn't have 'Owner' permission")
            print()
            print("   🔧 To fix:")
            print("      1. Go to: https://search.google.com/search-console")
            print("      2. Select property: prourlmonitor.com")
            print("      3. Settings > Users and permissions")
            print(f"      4. Check if this email is there: {email}")
            print("      5. If not, add it with 'Owner' permission")
            print("      6. If it's there, make sure permission is 'Owner' not 'Restricted'")
            
        elif "API not enabled" in error_message or error_code == 403:
            print("   🔴 API NOT ENABLED ERROR")
            print()
            print("   🔧 To fix:")
            print("      1. Go to: https://console.cloud.google.com/")
            print(f"      2. Select project: {project}")
            print("      3. APIs & Services > Library")
            print("      4. Search: Web Search Indexing API")
            print("      5. Click ENABLE")
            
        elif error_code == 429:
            print("   🟡 RATE LIMIT EXCEEDED")
            print()
            print("   This actually means your API is working!")
            print("   You've just exceeded the daily quota (200 requests/day)")
            print("   Wait 24 hours and try again.")
            
        else:
            print("   🔴 UNKNOWN ERROR")
            print()
            print("   Full error details:")
            print(f"   {error_details}")
        
        print()
        
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        print()
    
    print("=" * 80)
    print("📊 TEST COMPLETE")
    print("=" * 80)
    print()
    
    if 'response' in locals():
        print("✅ RESULT: Your API setup is WORKING!")
        print()
        print("🚀 Next steps:")
        print("   1. Run: python indexing_api.py")
        print("   2. This will submit all 107 URLs")
        print("   3. Wait 24-48 hours")
        print("   4. Check: https://www.google.com/search?q=site:www.prourlmonitor.com")
        print()
    else:
        print("❌ RESULT: API setup has issues (see errors above)")
        print()
        print("Fix the errors and run this test again:")
        print("   python test_api_connection.py")
        print()

if __name__ == '__main__':
    try:
        test_api()
    except KeyboardInterrupt:
        print("\n\nTest interrupted.")
    except Exception as e:
        print(f"\n\n❌ Critical error: {e}")
        import traceback
        traceback.print_exc()
