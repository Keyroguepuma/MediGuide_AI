const medication = `tylenol`;


const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medication}&limit=1`;


fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data.results[0].warnings);
    console.log(data.results[0].do_not_use);
  });

