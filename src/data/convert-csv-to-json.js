const fs = require("fs");
const csv = require("csvtojson");

async function convert() {
  const province = await csv().fromFile("src/data/province.csv");
  const city = await csv().fromFile("src/data/city.csv");
  const district = await csv().fromFile("src/data/district.csv");
  const subdistrict = await csv().fromFile("src/data/subdistrict.csv");
  const postal = await csv().fromFile("src/data/postal_code.csv");

  const merged = postal.map((p) => {
    const sub = subdistrict.find((s) => s.id === p.subdistrict_id);
    const dist = district.find((d) => d.id === sub?.district_id);
    const cityData = city.find((c) => c.id === dist?.city_id);
    const prov = province.find((pr) => pr.id === cityData?.province_id);

    return {
      province: prov?.name || "",
      city: cityData?.name || "",
      sub_district: sub?.name || "",
      postal_code: p.postal_code,
    };
  });

  fs.writeFileSync(
    "src/data/indonesia.json",
    JSON.stringify(merged, null, 2)
  );

  console.log("✅ JSON berhasil dibuat di src/data/indonesia.json");
}

convert();
