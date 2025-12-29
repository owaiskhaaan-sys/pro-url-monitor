# Google Search Console Indexing Setup Guide

## 📋 Files Created:
- `sitemap-urls.txt` - All 123 URLs ready for indexing
- `indexing_api.py` - Python script for automatic indexing

## 🚀 Quick Setup (Step-by-Step):

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project:**
   - Click "Select a project" → "New Project"
   - Name: "URL Indexing" or any name
   - Click "Create"

3. **Enable Web Search Indexing API:**
   - In search bar, type: "Web Search Indexing API"
   - Click on it → Click "Enable"

4. **Create Service Account:**
   - Go to: IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Name: `indexing-service`
   - Description: "For URL indexing"
   - Click "Create and Continue"
   - Skip optional steps → Click "Done"

5. **Download JSON Key:**
   - Find your service account in list
   - Click three dots (⋮) → "Manage keys"
   - Click "Add Key" → "Create new key"
   - Choose "JSON" → Click "Create"
   - **Save file as `service-account.json` in project folder**

6. **Copy Service Account Email:**
   - From service account page, copy the email
   - Format: `indexing-service@project-name.iam.gserviceaccount.com`

### Step 2: Google Search Console Setup

1. **Go to Search Console:**
   - Visit: https://search.google.com/search-console

2. **Select Your Property:**
   - Choose: `prourlmonitor.com`

3. **Add Service Account as Owner:**
   - Click "Settings" (⚙️) in left sidebar
   - Click "Users and permissions"
   - Click "Add user"
   - Paste service account email
   - Permission: **Owner** (important!)
   - Click "Add"

### Step 3: Install Python Dependencies

```powershell
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Step 4: Run the Script

```powershell
python indexing_api.py
```

## 📊 What the Script Does:

1. ✅ Reads all 123 URLs from `sitemap-urls.txt`
2. ✅ Authenticates with Google using `service-account.json`
3. ✅ Submits each URL to Google Indexing API
4. ✅ Shows progress with success/failure status
5. ✅ Saves failed URLs to `failed-urls.txt` for retry

## ⚠️ Important Notes:

- **Daily Limit:** 200 URL submissions per day
- **Since you have 123 URLs:** All can be submitted in one run
- **Rate Limiting:** Script has 0.5 second delay between requests
- **Permissions:** Service account MUST have "Owner" permission in Search Console

## 🔄 Alternative: Manual Submission

If you prefer manual submission, you can:

1. **Submit Sitemap in Search Console:**
   - Go to: Sitemaps section
   - Add sitemap URL: `https://www.prourlmonitor.com/sitemap.xml`
   - Click "Submit"

2. **Use URL Inspection Tool:**
   - Copy URLs from `sitemap-urls.txt`
   - In Search Console, use "URL Inspection" tool
   - Paste URL → "Request Indexing"
   - Repeat for important pages (limited to 10-12 per day)

## 📈 Expected Results:

- **Immediate:** URLs submitted to Google
- **1-3 days:** URLs start appearing in index
- **1-2 weeks:** Full indexing of all pages
- **Check Status:** In Search Console → Coverage report

## 🆘 Troubleshooting:

### Error: "Permission denied"
- Make sure service account is added as Owner in Search Console
- Wait 5-10 minutes after adding for permissions to sync

### Error: "Daily quota exceeded"
- Google allows 200 URLs per day
- Run script again tomorrow for remaining URLs

### Error: "service-account.json not found"
- Place JSON file in same folder as `indexing_api.py`
- Check filename is exactly: `service-account.json`

## 💡 Pro Tips:

1. **Priority URLs First:**
   - Edit `sitemap-urls.txt` to put important pages at top
   - If quota reached, most important pages submitted first

2. **Monitor Results:**
   - Check Search Console Coverage report after 2-3 days
   - Look for indexed vs. submitted pages

3. **Resubmit Changes:**
   - When you update pages, run script again
   - API notifies Google of content changes

4. **Save Service Account:**
   - Keep `service-account.json` safe
   - Don't commit to GitHub (add to .gitignore)

---

## 📧 Service Account Email Format:

Your email will look like:
```
indexing-service@your-project-id.iam.gserviceaccount.com
```

Copy this email and add it to Search Console with **Owner** permission.

---

**Need help?** Follow each step carefully and you'll have automatic indexing working in 10-15 minutes! 🚀
