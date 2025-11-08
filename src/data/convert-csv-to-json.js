const fs = require("fs");
const csv = require("csvtojson");

async function convert() {
  // Baca CSV dengan header sesuai file yang tersedia
  const province = await csv().fromFile("src/data/province.csv"); // prov_id, prov_name
  const city = await csv().fromFile("src/data/city.csv"); // city_id, city_name, prov_id
  const district = await csv().fromFile("src/data/district.csv"); // dis_id, dis_name, city_id
  const subdistrict = await csv().fromFile("src/data/subdistrict.csv"); // subdis_id, subdis_name, dis_id
  const postal = await csv().fromFile("src/data/postal_code.csv"); // postal_id, subdis_id, dis_id, city_id, prov_id, postal_code

  // Gabungkan berdasarkan id yang sudah tersedia pada tabel postal_code
  const merged = postal.map((p) => {
    const sub = subdistrict.find((s) => s.subdis_id === p.subdis_id);
    const dist = district.find((d) => d.dis_id === p.dis_id);
    const cityData = city.find((c) => c.city_id === p.city_id);
    const prov = province.find((pr) => pr.prov_id === p.prov_id);

    return {
      province: prov?.prov_name || "",
      city: cityData?.city_name || "",
      sub_district: sub?.subdis_name || "",
      // district disimpan jika suatu saat dibutuhkan
      district: dist?.dis_name || "",
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
