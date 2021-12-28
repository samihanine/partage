const year = new Date().getFullYear();

const months = [
  { name: "01 janvier" },
  { name: "02 février" },
  { name: "03 mars" },
  { name: "04 avril" },
  { name: "05 mai" },
  { name: "06 juin" },
  { name: "07 juillet" },
  { name: "08 aout" },
  { name: "09 septembre" },
  { name: "10 octobre" },
  { name: "11 novembre" },
  { name: "12 décembre" },
]

const structure_a = [
  { name: "comptable" },
  { name: "fiscal" },
  { name: "juridique" },
  { name: "social" },
]

const structure_b = [
  { name: "juridique" },
  { name: "social", content :[
    { name: "DSN " + year },
  ]},
  { name: "comptable", content: [ 
    { name: "facture achats " + year, content: months }, 
    { name: "facture ventes " + year, content: months },
    { name: "relevés de banque " + year },
    { name: "fiscal " + year },
  ]}
]

const structures = [
  structure_a, 
  structure_b
]

export default structures;