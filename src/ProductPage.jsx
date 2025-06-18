import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);

  // --- Основний запит на товар ---
  async function fetchProduct(slug) {
    const response = await fetch("https://modniy-ostrov.com/api/product_by_slug", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      body: JSON.stringify({ slug, siteVersion: "ua_UA" }),
    });

    const translateResponse = await fetch("https://modniy-ostrov.com/assets/translations/locale-ua.json", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "uk,ru-RU;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6",
      },
      "body": null,
      "method": "GET"
    });

    const translate = await translateResponse.json();

    if (!response.ok) return null;
    const data = await response.json();
    setInfo(data?.hits?.hits?.[0]?._source.taxons.forEach(e => e.slug))
    console.log(data?.hits?.hits?.[1]?._source.taxons)
    console.log(data?.hits?.hits?.[0]?._source.taxons.map(e => (e.taxonomy?.trans?.ua.name??e.taxonomy?.name) + ':' + (e.trans?.ua?.name??e.name)))
    console.log(data?.hits?.hits?.[0]?._source.attachedProducts[0].trans.ua.description)
    console.log(data?.hits?.hits?.[0]?._source.activeSingleSizes)
    console.log(data?.hits?.hits?.[0]?._source.variants.map(e => e.dimensions))
    console.log(translate)

    let measures = [];
    data?.hits?.hits?.[0]?._source.variants.map(e => e.dimensions.map(ee => measures.push(translate.dimensions[ee.measure.name]+':'+ee.value)))
    console.log(measures);

    console.log(data?.hits?.hits?.[0]?._source.variants.map(e => e.options[0].sizeDescription))
    console.log(data?.hits?.hits?.[0]?._source.attribures)
    // console.log(data?.hits?.hits?.[0]?._source.trans.ua.name)
    const source = data?.hits?.hits?.[0]?._source;
    if (!source) return null;

    const images = (source.images || []).map(img => img.dressaPath).slice(1);

    return {
      id: source.id,
      url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${source.image?.dressaPath}`,
      price: source.priceUAH,
      name: source.correctedName,
      slug: source.slug,
      images,
      oldPrice: source.oldPriceUAH,
      similarParams: extractSimilarParams(source)
    };
  }

  // --- Формування параметрів для запиту схожих товарів ---
  function extractSimilarParams(source) {
    const category = source.mainCategory?.slug || "";
    const tsvet = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "tsvet")?.slug || "";
    const season = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "sezon")?.slug || "";
    const fason = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "fason")?.slug || "";
    const dlina = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "dlina")?.slug || "";

    return {
      id: source.id,
      category,
      slug: source.slug,
      tsvet,
      season,
      fason,
      dlina,
    };
  }

  // --- Запит схожих товарів ---
  async function fetchSimilarProducts(params) {
    const response = await fetch("https://modniy-ostrov.com/api/similar_products", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        params,
        page: 1,
        perPage: 10,
        siteVersion: "ua_UA",
        warehouse: "ua"
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const hits = data?.hits?.hits || [];
    return hits.map(hit => {
      const src = hit._source;
      return {
        name: src.correctedName,
        price: src.priceUAH,
        oldPrice: src.oldPriceUAH,
        slug: src.slug,
        url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${src.image?.dressaPath}`,
      };
    });
  }

  // --- Початкове завантаження товару та схожих ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const prod = await fetchProduct(slug);
      if (!prod) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(prod);
      const sim = await fetchSimilarProducts(prod.similarParams);
      setSimilar(sim);
      setLoading(false);
    };

    load();
  }, [slug]);

  if (loading) return <p>Завантаження...</p>;
  if (!product) return <p>Товар не знайдено</p>;

  const allImages = [product.url, ...product.images.map(img =>
    `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
  )];

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Назад
      </button>
      <h2>{product.name}</h2>
      {product.oldPrice && (
        <p>
          <s style={{ color: "red" }}>
            {(product.oldPrice / 100).toFixed(2)} грн
          </s>
        </p>
      )}
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {(product.price / 100).toFixed(2)} грн
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {allImages.map((img, i) => (
          <img key={i} src={img} alt={`Фото ${i}`} style={{ width: "200px" }} />
        ))}
      </div>

      <hr />
      <h3>Схожі товари:</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {similar.map((s, i) => (
          <div key={i} style={{ width: "180px", border: "1px solid #ccc", padding: "10px" }}>
            <img src={s.url} alt={s.name} style={{ width: "100%" }} />
            <h4>{s.name}</h4>
            {s.oldPrice && (
              <p>
                <s style={{ color: "red" }}>
                  {(s.oldPrice / 100).toFixed(2)} грн
                </s>
              </p>
            )}
            <p style={{ fontWeight: "bold" }}>
              {(s.price / 100).toFixed(2)} грн
            </p>
          </div>
        ))}
      </div>
      {info}
    </div>
  );
}