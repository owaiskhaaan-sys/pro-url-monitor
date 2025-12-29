import os

# Fix signup.js
signup_path = r'C:\Users\DELL\Downloads\pro-url-monitor backup\pro-url-monitor-main\pages\signup.js'
with open(signup_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Head import
if 'import Head from' not in content:
    content = content.replace(
        "import Layout from '../components/Layout';",
        "import Head from 'next/head';\nimport Layout from '../components/Layout';"
    )
    
    # Add Head section
    head_section = """  return (
    <Layout>
      <Head>
        <title>Sign Up - Create Your Pro URL Monitor Account</title>
        <meta name="description" content="Create a free Pro URL Monitor account. Get access to 100+ SEO tools, monitor website performance, check URLs, and manage your SEO campaigns. Sign up now!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>"""
    
    content = content.replace('  return (\n    <Layout>', head_section)
    
    with open(signup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ signup.js - Added meta tags')
else:
    print('✅ signup.js - Already has Head import')

# Fix dashboard.js
dashboard_path = r'C:\Users\DELL\Downloads\pro-url-monitor backup\pro-url-monitor-main\pages\app\dashboard.js'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Head import
if 'import Head from' not in content:
    content = content.replace(
        "import Layout from '../../components/Layout';",
        "import Head from 'next/head';\nimport Layout from '../../components/Layout';"
    )
    
    # Add Head section
    head_section = """  return (
    <Layout>
      <Head>
        <title>Dashboard - Pro URL Monitor</title>
        <meta name="description" content="Access your Pro URL Monitor dashboard. Monitor URLs, track website performance, manage SEO campaigns, and view analytics. Your command center for SEO success." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>"""
    
    content = content.replace('  return (\n    <Layout>', head_section)
    
    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ dashboard.js - Added meta tags')
else:
    print('✅ dashboard.js - Already has Head import')

print('\n✅ Signup and Dashboard pages updated!')
