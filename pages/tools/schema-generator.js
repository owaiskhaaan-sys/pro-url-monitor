import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function SchemaGenerator() {
  const [schemaType, setSchemaType] = useState('Article');
  const [formData, setFormData] = useState({});
  const [jsonOutput, setJsonOutput] = useState('');

  const schemaTemplates = {
    Article: {
      fields: [
        { name: 'headline', label: 'Article Headline', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'image', label: 'Image URL', type: 'url', required: true },
        { name: 'author', label: 'Author Name', type: 'text', required: true },
        { name: 'datePublished', label: 'Date Published', type: 'date', required: true },
        { name: 'publisher', label: 'Publisher Name', type: 'text', required: true },
        { name: 'publisherLogo', label: 'Publisher Logo URL', type: 'url', required: false }
      ],
      example: {
        headline: "How to Create Schema Markup for Better SEO",
        description: "Complete guide to implementing schema markup for rich snippets",
        image: "https://example.com/article-image.jpg",
        author: "John Doe",
        datePublished: "2025-12-17",
        publisher: "Example Blog",
        publisherLogo: "https://example.com/logo.png"
      }
    },
    Product: {
      fields: [
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'image', label: 'Image URL', type: 'url', required: true },
        { name: 'brand', label: 'Brand Name', type: 'text', required: true },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'currency', label: 'Currency (USD, EUR, etc.)', type: 'text', required: true },
        { name: 'availability', label: 'Availability', type: 'select', options: ['InStock', 'OutOfStock', 'PreOrder'], required: true },
        { name: 'ratingValue', label: 'Rating (0-5)', type: 'number', required: false },
        { name: 'reviewCount', label: 'Review Count', type: 'number', required: false }
      ],
      example: {
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-canceling headphones with 30-hour battery life",
        image: "https://example.com/headphones.jpg",
        brand: "AudioPro",
        price: "199.99",
        currency: "USD",
        availability: "InStock",
        ratingValue: "4.5",
        reviewCount: "127"
      }
    },
    FAQPage: {
      fields: [
        { name: 'questions', label: 'FAQ Items (Format: Q: question? A: answer)', type: 'textarea', required: true, placeholder: "Q: What is schema markup?\nA: Schema markup is structured data...\n\nQ: Why use schema?\nA: It helps search engines..." }
      ],
      example: {
        questions: "Q: What is schema markup?\nA: Schema markup is structured data that helps search engines understand your content better.\n\nQ: Why should I use schema markup?\nA: Schema can give you rich snippets in search results, increasing click-through rates."
      }
    },
    Organization: {
      fields: [
        { name: 'name', label: 'Organization Name', type: 'text', required: true },
        { name: 'url', label: 'Website URL', type: 'url', required: true },
        { name: 'logo', label: 'Logo URL', type: 'url', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: false },
        { name: 'telephone', label: 'Phone Number', type: 'tel', required: false },
        { name: 'email', label: 'Email', type: 'email', required: false },
        { name: 'address', label: 'Street Address', type: 'text', required: false },
        { name: 'city', label: 'City', type: 'text', required: false },
        { name: 'state', label: 'State/Region', type: 'text', required: false },
        { name: 'postalCode', label: 'Postal Code', type: 'text', required: false },
        { name: 'country', label: 'Country', type: 'text', required: false }
      ],
      example: {
        name: "ProURLMonitor",
        url: "https://prourlmonitor.com",
        logo: "https://prourlmonitor.com/logo.png",
        description: "Free SEO tools and website monitoring services",
        telephone: "+1-555-123-4567",
        email: "info@prourlmonitor.com"
      }
    },
    LocalBusiness: {
      fields: [
        { name: 'name', label: 'Business Name', type: 'text', required: true },
        { name: 'image', label: 'Image URL', type: 'url', required: true },
        { name: 'address', label: 'Street Address', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'state', label: 'State/Region', type: 'text', required: true },
        { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
        { name: 'country', label: 'Country', type: 'text', required: true },
        { name: 'telephone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'priceRange', label: 'Price Range (e.g. $$)', type: 'text', required: false },
        { name: 'openingHours', label: 'Opening Hours (e.g. Mo-Fr 09:00-17:00)', type: 'text', required: false }
      ],
      example: {
        name: "Joe's Coffee Shop",
        image: "https://example.com/coffee-shop.jpg",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "US",
        telephone: "+1-555-987-6543",
        priceRange: "$$",
        openingHours: "Mo-Fr 07:00-19:00"
      }
    }
  };

  const generateSchema = () => {
    const template = schemaTemplates[schemaType];
    let schema = {};

    if (schemaType === 'Article') {
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": formData.headline || "",
        "description": formData.description || "",
        "image": formData.image || "",
        "author": {
          "@type": "Person",
          "name": formData.author || ""
        },
        "datePublished": formData.datePublished || "",
        "publisher": {
          "@type": "Organization",
          "name": formData.publisher || "",
          "logo": {
            "@type": "ImageObject",
            "url": formData.publisherLogo || ""
          }
        }
      };
    } else if (schemaType === 'Product') {
      schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": formData.name || "",
        "description": formData.description || "",
        "image": formData.image || "",
        "brand": {
          "@type": "Brand",
          "name": formData.brand || ""
        },
        "offers": {
          "@type": "Offer",
          "price": formData.price || "",
          "priceCurrency": formData.currency || "USD",
          "availability": `https://schema.org/${formData.availability || 'InStock'}`
        }
      };
      if (formData.ratingValue) {
        schema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": formData.ratingValue,
          "reviewCount": formData.reviewCount || "1"
        };
      }
    } else if (schemaType === 'FAQPage') {
      const questions = (formData.questions || '').split('\n\n').filter(q => q.trim());
      schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(q => {
          const lines = q.split('\n');
          const question = lines[0]?.replace(/^Q:\s*/i, '').trim() || '';
          const answer = lines[1]?.replace(/^A:\s*/i, '').trim() || '';
          return {
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          };
        })
      };
    } else if (schemaType === 'Organization') {
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": formData.name || "",
        "url": formData.url || "",
        "logo": formData.logo || "",
        "description": formData.description || ""
      };
      if (formData.telephone) schema.telephone = formData.telephone;
      if (formData.email) schema.email = formData.email;
      if (formData.address) {
        schema.address = {
          "@type": "PostalAddress",
          "streetAddress": formData.address,
          "addressLocality": formData.city || "",
          "addressRegion": formData.state || "",
          "postalCode": formData.postalCode || "",
          "addressCountry": formData.country || ""
        };
      }
    } else if (schemaType === 'LocalBusiness') {
      schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": formData.name || "",
        "image": formData.image || "",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": formData.address || "",
          "addressLocality": formData.city || "",
          "addressRegion": formData.state || "",
          "postalCode": formData.postalCode || "",
          "addressCountry": formData.country || ""
        },
        "telephone": formData.telephone || ""
      };
      if (formData.priceRange) schema.priceRange = formData.priceRange;
      if (formData.openingHours) schema.openingHoursSpecification = {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      };
    }

    setJsonOutput(JSON.stringify(schema, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('✅ Schema markup copied to clipboard!');
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonOutput], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema-${schemaType.toLowerCase()}.json`;
    a.click();
  };

  const loadExample = () => {
    setFormData(schemaTemplates[schemaType].example);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Layout>
      <Head>
        <title>Schema Markup Generator (JSON-LD) - | ProURLMonitor</title>
        <meta name="description" content="Free schema markup generator. Create JSON-LD structured data for Article, Product, FAQ, Organization, and LocalBusiness to get rich snippets in Google." />
        <meta name="keywords" content="schema markup generator, JSON-LD generator, structured data tool, rich snippets, schema.org generator" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/schema-generator" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Schema Markup Generator (JSON-LD)</h1>
        <p className="text-gray-600 mb-8">Create structured data for rich snippets in Google search results - boost CTR with enhanced listings</p>

        {/* Schema Type Selector */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Select Schema Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.keys(schemaTemplates).map(type => (
              <button
                key={type}
                onClick={() => { setSchemaType(type); setFormData({}); setJsonOutput(''); }}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  schemaType === type
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={loadExample}
            className="mt-4 btn btn-secondary text-sm"
          >
            📝 Load Example Data
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="card">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">{schemaType} Details</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {schemaTemplates[schemaType].fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      rows="4"
                      placeholder={field.placeholder || ''}
                      className="input text-sm"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="input"
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="input"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={generateSchema}
              className="btn btn-primary w-full mt-4"
            >
              🚀 Generate JSON-LD Schema
            </button>
          </div>

          {/* Output Section */}
          <div className="card">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">JSON-LD Output</h2>
            {jsonOutput ? (
              <>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  <code>{jsonOutput}</code>
                </pre>
                <div className="flex gap-3 mt-4">
                  <button onClick={copyToClipboard} className="btn btn-primary flex-1">
                    📋 Copy Code
                  </button>
                  <button onClick={downloadJSON} className="btn btn-secondary flex-1">
                    💾 Download JSON
                  </button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                  <strong>💡 Implementation:</strong> Add this code in your page's &lt;head&gt; section:
                  <code className="block mt-2 bg-white p-2 rounded text-xs">
                    &lt;script type="application/ld+json"&gt;<br />
                    {'{'}JSON goes here{'}'}<br />
                    &lt;/script&gt;
                  </code>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                <p className="text-lg mb-2">👈 Fill in the form and generate</p>
                <p className="text-sm">Your JSON-LD schema will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Complete Guide to Schema Markup and Structured Data for SEO</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              If you're not using <strong>schema markup</strong>, you're leaving serious traffic on the table. I'm talking about those rich snippets you see in Google - star ratings, FAQs, prices, images - all that eye-catching stuff that makes listings stand out. Schema markup is the code that makes it happen, and it can literally double your click-through rate overnight.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">What is Schema Markup and Why It's a Game-Changer</h3>
            <p>
              <strong>Schema markup</strong> (also called structured data) is a specific vocabulary of tags you add to your HTML to help search engines understand what your content is about. It's like giving Google a cheat sheet - instead of guessing what your page contains, you're explicitly telling them "this is an article," "this is a product with a price," or "these are FAQ questions."
            </p>
            <p>
              The magic happens in search results. When Google understands your content through schema, they can display it as <strong>rich snippets</strong> - enhanced search results with additional information. A regular listing might just show title and description, but with schema, you could show star ratings, prices, availability, cooking times, event dates, or even a FAQ accordion right in the SERP. That visual enhancement makes your listing impossible to ignore.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding JSON-LD Format</h3>
            <p>
              There are three ways to implement schema: Microdata, RDFa, and <strong>JSON-LD</strong>. Google recommends JSON-LD because it's cleanest - the code sits in a script tag in your page's head, completely separate from your HTML. You don't have to mess up your existing markup with extra attributes.
            </p>
            <p>
              JSON-LD looks like JavaScript but it's just data. It follows a simple pattern: you specify the type of thing you're describing (Article, Product, etc.), then fill in the properties. Our <strong>schema generator tool</strong> handles all the syntax for you - just fill in the form and we'll create perfectly formatted JSON-LD ready to paste into your site.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How to Use Our Schema Markup Generator</h3>
            <p>
              Using our tool is ridiculously simple. First, choose your schema type from the buttons - Article, Product, FAQ, Organization, or LocalBusiness. Each type is designed for specific content. Then fill in the form fields (required fields are marked with a red asterisk). Not sure what to enter? Click "Load Example Data" to see a sample.
            </p>
            <p>
              Once you've filled everything in, hit "Generate JSON-LD Schema" and boom - perfect, valid schema code appears on the right. Copy it to your clipboard or download as a JSON file. Then paste it into your page's &lt;head&gt; section wrapped in a &lt;script type="application/ld+json"&gt; tag. That's it. No coding required.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Article Schema for Blog Posts and News</h3>
            <p>
              <strong>Article schema</strong> is perfect for blog posts, news articles, and editorial content. It tells Google who wrote the article, when it was published, who published it, and includes the featured image. This can get you into Google News, show author bylines in search results, and even display article images as rich cards.
            </p>
            <p>
              The most important fields are headline (your article title), datePublished (when you published it), author name, and publisher information with logo. The publisher logo is crucial - Google uses it to display your brand in search results. Make sure the logo is at least 600x60 pixels and placed on a white or transparent background.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Product Schema for E-Commerce</h3>
            <p>
              If you sell anything online, <strong>Product schema</strong> is mandatory. This is what gets you those gorgeous product rich snippets with prices, star ratings, stock status, and images right in Google search. Studies show product rich snippets can increase CTR by 30% or more compared to plain listings.
            </p>
            <p>
              Essential fields include product name, description, image, brand, price with currency, and availability (InStock, OutOfStock, PreOrder). If you have customer reviews, definitely include aggregateRating with your average rating and total review count. Google loves showing star ratings in search results - they're click magnets.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">FAQ Schema for Question Pages</h3>
            <p>
              This is my favorite schema type for driving traffic. <strong>FAQ schema</strong> creates those expandable Q&A boxes directly in Google search results. Users can see and interact with your answers without even clicking through to your site (though they often do anyway because they want more detail).
            </p>
            <p>
              Format your FAQs in our tool like this: "Q: Your question here? A: Your answer here." Separate multiple Q&As with double line breaks. Google will display up to 2-3 questions in the rich snippet, creating a massive listing that dominates the SERP. This is especially effective for commercial keywords where people have common questions before buying.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Organization and LocalBusiness Schema</h3>
            <p>
              <strong>Organization schema</strong> goes on your homepage or About page to define your business entity. It includes your official name, logo, website URL, contact information, and social profiles. This helps Google create your Knowledge Panel and understand your brand identity across the web.
            </p>
            <p>
              <strong>LocalBusiness schema</strong> is crucial for any business with a physical location. It includes your full address, phone number, opening hours, and price range. This powers your Google Business Profile and helps you appear in local map pack results. If you're a restaurant, doctor's office, retail store, or any local business, this schema is non-negotiable.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Testing and Validating Your Schema</h3>
            <p>
              After implementing schema, you MUST test it. Use Google's Rich Results Test (search.google.com/test/rich-results) to validate your markup. Paste your URL or code snippet and Google will tell you if it's valid and what rich results you're eligible for. Errors in schema can prevent rich snippets from appearing, so always validate before going live.
            </p>
            <p>
              Also check Google Search Console's Enhancement reports. After a few days, Google will show you which pages have valid schema, which have errors, and what rich snippets were triggered. This is gold for troubleshooting. If your schema is valid but not showing rich snippets, it might be a content quality issue or Google might need more time to trust your site.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common Schema Markup Mistakes to Avoid</h3>
            <p>
              The biggest mistake? Marking up content that doesn't exist on the page. Don't add Product schema claiming 5-star reviews if you have zero reviews. Google calls this "spammy structured data" and can penalize you. Only mark up content that's visible to users on the page.
            </p>
            <p>
              Another common error is using the wrong schema type. Don't use Article schema for product pages or Product schema for blog posts. Match the schema type to your actual content. Also, avoid duplicate schemas - if you have a plugin adding schema and you manually add it too, you'll have conflicts. Check what's already there before adding more.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Schema Markup and Voice Search</h3>
            <p>
              Here's something most people miss - <strong>schema markup helps you rank for voice search</strong>. When someone asks Alexa or Google Home a question, the assistant often pulls answers from pages with FAQ schema. If you optimize for "how to" and "what is" questions with FAQ schema, you're positioning yourself for voice search dominance.
            </p>
            <p>
              Voice search results tend to come from position 1-3 in regular search, and they heavily favor pages with structured data. So schema isn't just about visual rich snippets - it's about being the source of truth for voice assistants. That's becoming huge as voice search grows.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Does Schema Markup Directly Improve Rankings?</h3>
            <p>
              No, schema is not a direct ranking factor. Google has confirmed this multiple times. However - and this is a big however - schema indirectly boosts rankings through increased CTR. When your listing has star ratings, prices, and rich snippets, more people click it. Google sees that high CTR and interprets it as "users prefer this result," which over time improves your rankings.
            </p>
            <p>
              Think of it this way: two pages rank #3 for the same keyword. One has plain text snippet, the other has Product schema with stars and price. The schema page gets 10% CTR while the plain page gets 3%. After a few weeks, Google notices and promotes the schema page to #2, then #1. That's the indirect ranking boost in action.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Advanced Schema: Combining Multiple Types</h3>
            <p>
              You can use multiple schema types on one page when it makes sense. A recipe page might have both Article schema (for the blog post) and Recipe schema (for the actual recipe). A product review could combine Article schema with Review schema. Just make sure each schema accurately represents distinct content on the page.
            </p>
            <p>
              When combining schemas, nest them properly in your JSON-LD. You can have multiple script tags or one script tag with an array of schemas. Our generator creates single schemas, but you can manually combine outputs. Just validate with Google's testing tool to ensure everything's formatted correctly.
            </p>

            <p className="text-lg font-semibold text-emerald-700 mt-6">
              Ready to dominate search results with rich snippets? Use our free schema generator above to create JSON-LD structured data in seconds. No coding required - just fill the form, copy the code, and watch your CTR skyrocket. Combine this with our <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">Meta Tag Generator</a> for compelling titles and our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit tool</a> to ensure your entire site is optimized for maximum visibility.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 card bg-gray-50">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What is schema markup and why do I need it?</h3>
              <p className="text-gray-700">Schema markup is structured data that helps search engines understand your content. It enables rich snippets (star ratings, prices, FAQs) in Google search results, significantly increasing click-through rates.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Does schema markup improve SEO rankings?</h3>
              <p className="text-gray-700">Schema isn't a direct ranking factor, but it indirectly boosts rankings by increasing CTR. Higher click-through rates signal to Google that users prefer your result, which can improve your position over time.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do I add schema markup to my website?</h3>
              <p className="text-gray-700">Use our generator above to create JSON-LD code, then paste it in your page's &lt;head&gt; section inside a &lt;script type="application/ld+json"&gt; tag. Test it with Google's Rich Results Test tool.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Which schema type should I use?</h3>
              <p className="text-gray-700">Use Article for blog posts, Product for e-commerce, FAQ for question pages, Organization for your company info, and LocalBusiness for physical locations. Match the schema type to your actual content.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
