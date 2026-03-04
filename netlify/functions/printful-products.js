// Netlify Function: securely fetches products from Printful API
// The API key is stored in Netlify environment variables (never in code)

exports.handler = async function (event) {
  const API_KEY = process.env.PRINTFUL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Printful API key not configured" }),
    };
  }

  try {
    // Fetch all store products
    const res = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: "Bearer " + API_KEY },
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Printful API error", detail: errText }),
      };
    }

    const data = await res.json();
    const products = data.result || [];

    // For each product, fetch detailed info (images, variants with prices)
    const detailed = await Promise.all(
      products.slice(0, 8).map(async (p) => {
        try {
          const detailRes = await fetch(
            "https://api.printful.com/store/products/" + p.id,
            { headers: { Authorization: "Bearer " + API_KEY } }
          );
          if (!detailRes.ok) return null;
          const detailData = await detailRes.json();
          const product = detailData.result;
          const firstVariant = product.sync_variants && product.sync_variants[0];
          return {
            id: product.sync_product.id,
            name: product.sync_product.name,
            image: product.sync_product.thumbnail_url,
            price: firstVariant ? firstVariant.retail_price : null,
            currency: firstVariant ? firstVariant.currency : "USD",
            url: firstVariant ? firstVariant.product.image : null,
          };
        } catch {
          return null;
        }
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify(detailed.filter(Boolean)),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to fetch products", detail: err.message }),
    };
  }
};
