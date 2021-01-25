exports.features = (projectId, tokenData) => {
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  let features = [];

  //console.log("hashString:"+tokenData);
  if (projectId===0){
    let hashPairs=[];
    let decPairs=[];



      //tokenData = this.props.tokenHashes;
      for (let j = 0; j<32;j++){

        hashPairs.push(tokenData.slice(2+(j*2),4+(j*2)));
      }

      decPairs = hashPairs.map(x=>{
      return parseInt(x,16);
    });
    //console.log(hashPairs);
      let steps;
      if (decPairs[28]<3){
        features.push("HyperRainbow");
      } else if (Math.floor(decPairs[26].map( 0, 255, 12, 20))===14 && Math.floor(decPairs[28].map(0,255,5,50))===11 && decPairs[22]>=32 && decPairs[31] >= 35) {
        features.push("Perfect Spectrum");
      }





      if (decPairs[22]<32 && decPairs[31] < 35){
        features.push("Pipe");
        steps=50;
      } else if (decPairs[31] < 35){
        features.push("Slinky");
        steps=50;
      }
      if (decPairs[22]<32 && decPairs[31] >= 35){
        features.push("Fuzzy");
        steps=1000;
      }
      if (decPairs[23]<15){
        if (features.includes("Fuzzy")){

        } else if (!features.includes("Slinky") && !features.includes("Pipe")){
        features.push("Bold");
      }
      }
      if (decPairs[24]<30){
        if (features.includes("Bold") || features.includes("Slinky") || features.includes("Fuzzy")){
        } else {
        features.push("Ribbed (Color: "+decPairs[25]+")");
      }
      }
      if (decPairs[22]>=32 && decPairs[31] >= 35){
        steps=200;
      }
      let startingColor=decPairs[29];
      let endingColor=decPairs[28] < 3?(decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/0.5)%255:Math.floor((decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/Math.floor(decPairs[28].map(0,255,5,50)))%255);
      let difference = function (a, b) { return Math.abs(startingColor - endingColor); };
      if (difference()<3 || difference()>252){
        if (!features.includes("Perfect Spectrum")){
          features.splice(0,0,"Full Spectrum");
        }
      };

      features.push("Starting Color: "+decPairs[29]);
      if (decPairs[28] < 3){
        features.push("End Color: "+(decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/0.5)%255);
        features.push("Color Spread: 0.5");
      } else {
        features.push("End Color: "+Math.floor((decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/Math.floor(decPairs[28].map(0,255,5,50)))%255));
        features.push("Color Spread: "+Math.floor(decPairs[28].map(0,255,5,50)));
      }

      if (decPairs[30] < 128){
        features.push("Color Direction: Reverse");
      } else {
        features.push("Color Direction: Forward");
      }
      features.push("Height: "+Math.floor(decPairs[27].map(0, 255, 3, 4)));
      features.push("Segments: "+Math.floor(decPairs[26].map( 0, 255, 12, 20)));
      features.push("Steps Between Segments: "+steps);
  } else if (projectId===2){
    let pair = tokenData.slice(5,7);
    let dec = parseInt(pair,16);


    //console.log(decPairs[6]);
    if (dec>252){
      features.push("Complementary Variant");
    } else if (dec>239){
      features.push("Dark Variant");
    } else if (dec>226){
      features.push("Light Variant");
    } else  {
      features.push("Standard Variant");
    }

  } else if (projectId===3){
    console.log("in script"+tokenData)

    let seedA = parseInt(tokenData.slice(0, 16), 16);
    console.log("seedA: "+seedA);
    let blotcolorname = [];

    let colfreqs = [40, 80, 100, 10, 3, 100, 100, 80, 3, 40, 10, 100, 40, 10, 100, 80, 3, 100, 100, 10, 3, 40, 100, 80, 100, 10, 80, 40, 100, 3, 40, 3, 100, 100, 80, 10, 28, 3, 80, 100, 100, 40];
    let colnames = ["White", "Silver Gray", "Spanish Gray", "Gunmetal Gray", "Stone Gray", "Marengo Gray", "Argentinian Blue", "Savoy Blue", "Egyptian Blue", "Bleu de France", "Delft Blue", "Moroccan Blue", "Avocado Green", "Forest Green", "Mantis Green", "Shamrock Green", "Tea Green", "Emerald Green", "Cardinal Red", "Carmine Red", "Crimson Red", "Salmon Red", "Lust Red", "Spanish Red", "Tyrian Purple", "Royal Purple", "Orchid Purple", "Mardis Gras Purple", "Palatinate Purple", "Thistle Purple", "Cream Yellow", "Xanthic Yellow", "Canary Yellow", "Golden Yellow", "Hunyadi Yellow", "Process Yellow", "Beaver Brown", "Beige Brown", "Chestnut Brown", "Chocolate Brown", "Dark Brown", "Khaki Brown"];

    let numblobs = 1;
    let randnum = Math.floor((rnd().map(0,1,0,1000))); //int(map(rnd(), 0, 1, 0, 1000));
    console.log("randnum"+randnum);
    if (randnum < 300) {
      numblobs = 2;
      if (randnum < 50) {
      numblobs = 3;
      }
    }

    features.push(GetBlotTypeFromNumblots(numblobs));
    for (let i = 0; i < numblobs; i++) {
      getFillColor();
      features.push("Color: "+blotcolorname[i]);
    }

    function getFillColor() {
      let whichArray =[];
      let which = Math.floor((rnd().map(0,1,0,colnames.length))); //int(map(rnd(), 0, 1, 0, colnames.length));
      //whichArray.push(which);
      let threshold = rnd().map(0,1,0,100); //map(rnd(), 0, 1, 0, 100);

      while (threshold > colfreqs[which]) {
          which = Math.floor((rnd().map(0,1,0,colnames.length))); //int(map(rnd(), 0, 1, 0, colnames.length));
          whichArray.push(which);
        }
        blotcolorname.push(colnames[which]);
        console.log("WhichArray: "+whichArray);
      }

      function GetBlotTypeFromNumblots(numblots) {
        if (numblots === 3) {
          return "Ternary Cryptoblot";
        }
        if (numblots === 2) {
          return "Binary Cryptoblot";
        }
        if (numblots === 1) {
          return "Unary Cryptoblot";
        }
      }

      function rnd() {
        seedA ^= seedA << 13;
        seedA ^= seedA >> 17;
        seedA ^= seedA << 5;

        return (((seedA < 0) ? ~seedA + 1 : seedA) % 1000) / 1000;
      }

  } else if (projectId===4){


    let hashPairs = [];
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)));
    }
    let rvs = hashPairs.map(x => {
      return parseInt(x, 16) % 20;
    });

    let palette_choices = ["Moonrise",
    "Budapest",
    "Rushmore",
    "Invaders",
    "Jade Theory",
    "Frost",
    "Purple Rain",
    "Kingdom"
    ];

    let rv0 = rvs[0];

  let rv2 = rvs[2];
  let rv3 = rvs[3];
  let rv4 = rvs[4];
  let rv5 = rvs[5];
  let rv6 = rvs[6];

  let cp_r = rnd_outcome(rv0, [19, 18, 17, 16, 14, 12, 8], [7, 6, 5, 4, 3, 2, 1], 0);
  var pie_count = rnd_outcome(rv2, [19, 18, 17, 16, 14, 12], [4, 5, 6, 8, 14, 12], 10);
  var stk_color = rnd_outcome(rv3, [10], ["Silver"], "Midnight");
  var pie_number = rnd_outcome(rv4, [10], [2], 1);
  var palette = palette_choices[cp_r]

  if (rv5 === 19) {
    if (rv6 === 19) {
      stk_color = "Lime"
      palette = "Cyber"
    }
  }
  if (rv5 === 18) {
    if (rv6 === 18) {
      stk_color = "Silver"
      palette = "Cloud Nine"
    }
  }

  features = ["Palette: " + palette,
            "Count: " + String(pie_count-1),
            "Slices: " + (pie_number === 2 ? "Multi" : "Single"),
            "Stroke: " + stk_color]

  function rnd_outcome(input, values, outcome, fallback) {
    var zip = (a,b) => a.map((x,i) => [x,b[i]]);
    for (let [a, b] of zip(values, outcome))
      if (input >= a) {
        return b;
      }
      return fallback;
    }

  } else if (projectId===8)
  {
    let mass_lower = 600.0;
    let mass_upper = 1200.0;
    let aper_lower = 100.0;
    let aper_upper = 400.0;
    let forc_lower = 550.0;
    let forc_upper = 2250.0;
    let turb_lower = 0.001;
    let turb_upper = 1.000;
    let chao_lower = 0.001;
    let chao_upper = 0.002;
    let deta_lower = 4.0;
    let deta_upper = 10.0;
    let final_sat = 0.0;
    let gradlev = 0;

    let data = [];

    function evaluate(n, metadata)
    {
      let meta =
      {
        'description': "",
        'prob': 0
      }

      let points =
      {
        'form': 0,
        'rare': 0
      }

      if(n===1.0)
      {
        meta.desciption = "absolute";
        points.rare = 2;
        points.form = 7;
        meta.prob = 0.001;
      }
      else if(n===0.0)
      {
        meta.desciption = "void";
        points.rare = 2;
        points.form = 7;
        meta.prob = 0.001;
      }
      else if(n <= 0.01)
      {
        meta.desciption = "minimal";
        points.rare = 1;
        points.form = 5;
        meta.prob = 0.01;
      }
      else if (n > 0.01 && n < 0.1)
      {
        meta.desciption = "marginal";
        points.form = 3;
        meta.prob = 0.09;
      }
      else if (n > 0.1 && n < 0.25)
      {
        meta.desciption = "low";
        points.form = 1;
        meta.prob = 0.15;
      }
      else if (n > 0.99)
      {
        meta.desciption = "extreme";
        points.rare = 1;
        points.form = 5;
        meta.prob = 0.01;
      }
      else if (n < 0.99 && n > 0.9)
      {
        meta.desciption = "super";
        points.form = 3;
        meta.prob = 0.09;
      }
      else if (n < 0.90 && n > 0.75)
      {
        meta.desciption = "high";
        points.form = 1;
        meta.prob = 0.15;
      }
      else
      {
        meta.desciption = "average";
        meta.prob = 0.5;
      }

      return metadata ? meta : points;
    }

    function generate_artblocks_metadata(formdata)
    {
      let meta_mass = evaluate(formdata.mass, true);
      let meta_force = evaluate(formdata.force, true);
      let meta_symmetry = evaluate(formdata.symmetry, true);
      let meta_turbulence = evaluate(formdata.turbulence, true);
      let meta_chaos = evaluate(formdata.chaos, true);

      let prob = meta_mass.prob * meta_force.prob * meta_symmetry.prob * meta_turbulence.prob * meta_chaos.prob;

      let massstr = "Mass: " + (formdata.mass * 100).toFixed(1) + "% ("+ meta_mass.desciption.toUpperCase() + ")";
      let forcestr = "Force: " + (formdata.force * 100).toFixed(1) + "% ("+ meta_force.desciption.toUpperCase() + ")";
      let symstr = "Symmetry: " + (formdata.symmetry * 100).toFixed(1) + "% ("+ meta_symmetry.desciption.toUpperCase() + ")";
      let turbstr = "Turbulence: " + (formdata.turbulence * 100).toFixed(1) + "% ("+ meta_turbulence.desciption.toUpperCase() + ")";
      let chaosstr = "Chaos: " + (formdata.chaos * 100).toFixed(1) + "% ("+ meta_chaos.desciption.toUpperCase() + ")";
      let prostr = "Chance: 1 in " + Math.trunc((1.0/(prob)));
      let satstr = "Saturation: " + (final_sat * 100).toFixed(1) + "%";
      let gradstr = "Colour Set: " + gradlev;

      return [massstr, forcestr, symstr, turbstr, chaosstr, satstr, gradstr, prostr];
    }

    function lerp (start, end, amt)
    {
      return (1-amt)*start+amt*end;
    }

    function process_formdata(hashdata)
    {
      let idx_mass = 1;
      let idx_aperture = 2;
      let idx_force   = 3;
      let idx_symmetry = 4;
      let idx_turbulence = 5;
      let idx_chaos = 6;
      let idx_saturation = 7;
      let idx_detail = 8;

      let formdata =
      {
        'mass':         hashdata[idx_mass],
        'aperture':     hashdata[idx_aperture],
        'force':        hashdata[idx_force],
        'symmetry':     hashdata[idx_symmetry],
        'turbulence':   hashdata[idx_turbulence],
        'chaos':        hashdata[idx_chaos],
        'saturation':   hashdata[idx_saturation],
        'detail':       hashdata[idx_detail]
      };

      return formdata;
    }

    function evaluate_points(fd)
    {
        let points_mass       = evaluate(fd.mass, false);
        let points_force      = evaluate(fd.force, false);
        let points_symmetry   = evaluate(fd.symmetry, false);
        let points_turbulence = evaluate(fd.turbulence, false);
        let points_chaos      = evaluate(fd.chaos, false);

        let points =
        {
          'form': points_mass.form +
                  points_force.form +
                  points_symmetry.form +
                  points_turbulence.form +
                  points_chaos.form,

          'rare': points_mass.rare +
                  points_force.rare +
                  points_symmetry.rare +
                  points_turbulence.rare +
                  points_chaos.rare
        };

        return points;
    }

    function generate_renderdata(fd)
    {
      let points = evaluate_points(fd);

      let renderdata =
      {
        'mass':         lerp(mass_lower,  mass_upper,  fd.mass),
        'aperture':     lerp(aper_lower,  aper_upper,  fd.aperture),
        'force':        lerp(forc_lower,  forc_upper,  fd.force),
        'symmetry':     1.0-fd.symmetry,
        'turbulence':   lerp(turb_lower,  turb_upper,  fd.turbulence),
        'chaos':        lerp(chao_lower,  chao_upper,  fd.chaos),
        'saturation':   fd.saturation,
        'form_points':  points.form,
        'rare_points':  points.rare,
        'detail':       lerp(deta_lower, deta_upper, fd.detail)
      };

      return renderdata;
    }

    function process_hash(txn)
    {
      let hash_index = 0;

      for (let i = 2; i < 65; i += 2)
      {
        let from = i;
        let to = i + 2;
        let s = txn.substring(from, to);

        data[hash_index] = parseInt(s, 16) / 255.0;

        hash_index++;
      }

      return data;
    }

    function init(txn)
    {
      let hashdata    = process_hash(txn);
      let formdata    = process_formdata(hashdata);
      let renderdata  = generate_renderdata(formdata);

      render(renderdata);

      let ab_metadata = generate_artblocks_metadata(formdata);

      return ab_metadata;
    }
    let sat;

    function render(rd)
    {
        gradlev = rd.rare_points + 1;

        if (rd.form_points === 0)
        {
          sat = 0.0;
        } else if (rd.form_points > 0 && rd.form_points < 7)
        {
          sat = lerp(0.0, 0.25, rd.saturation);
        } else if (rd.form_points >= 7 && rd.form_points < 9)
        {
          sat = lerp(0.2, 0.75, rd.saturation);
        } else if (rd.form_points >= 9 && rd.form_points < 10)
        {
          sat = lerp(0.75, 0.9, rd.saturation);
        } else if (rd.form_points >= 10 && rd.form_points < 11)
        {
          sat = lerp(0.9, 1.0, rd.saturation);
        } else
        {
          sat = 1.0;
        }

        final_sat = sat;
    }

    features = init(tokenData);
  } else if (projectId===9){

    const ignitionFeatures = (hash) => {
const features = [];
const matrices = [];
const shapes = [];
const stack = [];
const rule = {};
let NR = 0;
let NC = 0;
let FT = 0;
let transformScene = null;
let nFrames = 0;
let hue = 0;
let startRule = "start";
let seed = parseInt(hash.slice(0, 16), 16);
features.push("Seed: " + seed);
let minSize = 0.01;
let maxDepth = 10000000;
let minComplexity = 1;
const transforms = {
  x(m, v) {
    m[12] += m[0] * v;
    m[13] += m[1] * v;
    m[14] += m[2] * v;
  },
  y(m, v) {
    m[12] += m[4] * v;
    m[13] += m[5] * v;
    m[14] += m[6] * v;
  },
  z(m, v) {
    m[12] += m[8] * v;
    m[13] += m[9] * v;
    m[14] += m[10] * v;
  },
  s(m, v) {
    const a = Array.isArray(v);
    const x = a ? v[0] : v;
    const y = a ? v[1] : x;
    const z = a ? v[2] : x;
    m[0] *= x;
    m[1] *= x;
    m[2] *= x;
    m[3] *= x;
    m[4] *= y;
    m[5] *= y;
    m[6] *= y;
    m[7] *= y;
    m[8] *= z;
    m[9] *= z;
    m[10] *= z;
    m[11] *= z;
  },
  rx(m, v) {
    const rad = Math.PI * (v / 180);
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = m[4];
    const a11 = m[5];
    const a12 = m[6];
    const a13 = m[7];
    const a20 = m[8];
    const a21 = m[9];
    const a22 = m[10];
    const a23 = m[11];
    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a10 * -s + a20 * c;
    m[9] = a11 * -s + a21 * c;
    m[10] = a12 * -s + a22 * c;
    m[11] = a13 * -s + a23 * c;
  },
  ry(m, v) {
    const rad = Math.PI * (v / 180);
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = m[0];
    const a01 = m[1];
    const a02 = m[2];
    const a03 = m[3];
    const a20 = m[8];
    const a21 = m[9];
    const a22 = m[10];
    const a23 = m[11];
    m[0] = a00 * c + a20 * -s;
    m[1] = a01 * c + a21 * -s;
    m[2] = a02 * c + a22 * -s;
    m[3] = a03 * c + a23 * -s;
    m[8] = a00 * s + a20 * c;
    m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c;
    m[11] = a03 * s + a23 * c;
  },
  rz(m, v) {
    const rad = Math.PI * (v / 180);
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = m[0];
    const a01 = m[1];
    const a02 = m[2];
    const a03 = m[3];
    const a10 = m[4];
    const a11 = m[5];
    const a12 = m[6];
    const a13 = m[7];
    m[0] = a00 * c + a10 * s;
    m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s;
    m[3] = a03 * c + a13 * s;
    m[4] = a00 * -s + a10 * c;
    m[5] = a01 * -s + a11 * c;
    m[6] = a02 * -s + a12 * c;
    m[7] = a03 * -s + a13 * c;
  }
};
let nCubes = 0;
const pushGeometry = (m, t, shape, nv) => {
  const s = copy(m);
  for (const c in t) {
    transforms[c](s, t[c]);
  }
  s[22] = shape;
  matrices.push(s);
};
const PYRAMID = (m, t) => {
  pushGeometry(m, t, 2, 18);
};
const CUBE = (m, t) => {
  pushGeometry(m, t, 1, 36);
};
const SIZE = (m) => {
  return Math.min(
    m[0] * m[0] + m[1] * m[1] + m[2] * m[2],
    m[4] * m[4] + m[5] * m[5] + m[6] * m[6],
    m[8] * m[8] + m[9] * m[9] + m[10] * m[10]
  );
};
const random = (_) => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const randint = (s, e = 0) => {
  if (e === 0) {
    e = s;
    s = 0;
  }
  return Math.floor(s + random() * (e - s + 1));
};
const transform = (s, p) => {
  const m = copy(s);
  m[19]++;
  for (const c in p) transforms[c](m, p[c]);
  if (minSize === 0) return m;
  else {
    if (SIZE(m) < minSize) m[20] = -1;
    return m;
  }
};
const copy = (s) => {
  return [
    s[0], s[1], s[2], s[3],
    s[4], s[5], s[6], s[7],
    s[8], s[9], s[10], s[11],
    s[12], s[13], s[14], s[15],
    s[16], s[17], s[18], s[19],
    s[20], s[21], s[22]
  ];
};
const runshapes = (start, t) => {
  let comp = 0;
  let minComp = minComplexity;
  do {
    comp = 0;
    stack.length = 0;
    matrices.length = 0;
    NR = 0;
    FT = 0;
    nFrames = 0;
    NC = 0;
    nCubes = 0;
    rule[start](
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
      t
    );
    do {
      const s = stack.shift();
      if (s !== undefined && s[19] <= maxDepth) {
        shapes[s[21]](s);
        NR++;
        comp++;
      }
    } while (stack.length);
  } while (comp < minComp-- || NC < 2);
};
const singlerule = (i) => {
  return (s, t) => {
    s = transform(s, t);
    if (s[20] === -1) return;
    s[21] = i;
    stack.push(s);
  };
};
const randomrule = (totalWeight, weight, index, len) => {
  return (s, t) => {
    s = transform(s, t);
    if (s[20] === -1) return;
    let w = 0;
    const r = random() * totalWeight;
    for (let i = 0; i < len; i++) {
      w += weight[i];
      if (r <= w) {
        s[21] = index[i];
        stack.push(s);
        return;
      }
    }
  };
};
const newStructure = () => {
  setup();
  runshapes(startRule, transformScene || {});
  if (M === true) features.push("Hue: " + (hue % 360));
  features.push("Number of rules executed: " + NR);
  features.push("Number of Fractal Subdivisions: " + FT);
  features.push("Number of Frames: " + nFrames);
  features.push("Number of Lasers: " + NC);
  features.push("Number of Cubes: " + nCubes);
};
const structure = (setup, rules) => {
  shapes.length = 0;
  for (const namerule in rules) {
    const r = rules[namerule];
    if (Array.isArray(r)) {
      let totalWeight = 0;
      const weight = [];
      const index = [];
      for (let i = 0; i < r.length; i += 2) {
        totalWeight += r[i];
        shapes.push(r[i + 1]);
        weight.push(r[i]);
        index.push(shapes.length - 1);
      }
      rule[namerule] = randomrule(totalWeight, weight, index, index.length);
    } else {
      shapes.push(r);
      rule[namerule] = singlerule(shapes.length - 1);
    }
  }
  newStructure();
};
random();
const M = random() > 0.05 ? true : false;
const G = random() > 0.05 ? 1 : 2;
const E = random() > 0.02 ? false : true;
const R = random() > 0.05 ? 0.55 : 0.76 * G;
const N = random() > 0.5 ? "d1" : "d2";
const U = random() > 0.05 ? 30 : 0;

if (E) features.push("Rare ETH version");
if (R === 0.76) features.push("Spread mode");
else if (R === 1.52) features.push("Super Spread mode");
features.push((N === "d1" ? "Day" : "Night") + " mode");
if (M === false) {
  features.push("Monochrome mode");
} else if (U === 0) features.push("Bi-colors mode");
if (M === false && N === "d2") features.push("Night x Monochrome = Gold");
const setup = function () {
  startRule = "start";
  transformScene = { s: R === 0.55 ? 2.2 : 2 };
  maxDepth = 100;
  minSize = 0.001;
  minComplexity = 500;
};
const rules = {
  start(s) {
    NC = 0;
    hue = randint(720);
    rule.WHOLE(s, {
      rx: randint(40) - 20,
      ry: randint(360)
    });
  },
  WHOLE(s) {
    FT++;
    rule.QUAD(s, { x: -R, y: -R, z: -R });
    rule.QUAD(s, { x: R, y: -R, z: -R });
    rule.QUAD(s, { x: -R, y: R, z: -R });
    rule.QUAD(s, { x: R, y: R, z: -R });
    rule.QUAD(s, { x: -R, y: -R, z: R, rz: 90 });
    rule.QUAD(s, { x: R, y: -R, z: R, rz: 90 });
    rule.QUAD(s, { x: -R, y: R, z: R, rz: 90 });
    rule.QUAD(s, { x: R, y: R, z: R, rz: 90 });
  },
  QUAD: [
    0.25,
    (s) => {
      rule.FRAME(s, { s: 1.1 });
    },
    0.1,
    (s) => {
      rule.COOLER(s, { s: 1 });
    },
    0.5,
    (s) => {
      rule.CUBE(s, { s: 1.1 });
    },
    0.25,
    (s) => {
      rule.WHOLE(s, { s: 0.5 });
    },
    0.5,
    (s) => {}
  ],
  COOLER(s) {
    if (SIZE(s) > 0.055) {
      NC++;
      CUBE(s, { s: [1.3, 0.4, 0.4] });
      for (let x = -1000; x < 1000; x += 20) {
        CUBE(s, { x: x, s: [20, 0.25, 0.25] });
      }
      for (let x = -0.5; x <= 0.5; x += 0.1) {
        CUBE(s, { x: x, s: [0.02, 1, 1] });
      }
    } else {
      rule.CUBE(s);
      nCubes++;
    }
  },
  CUBE(s) {
    if (random() > 0.75) {
      random();
    }
    CUBE(s, { s: 0.98 });
    nCubes++;
  },
  FRAME(s) {
    nFrames++;
    if (E === false) {
      CUBE(s, { s: 0.35 });
      nCubes++;
    } else {
      PYRAMID(s, { y: 0.23, s: 0.4 });
      PYRAMID(s, { rx: 180, y: 0.23, s: 0.4 });
    }
    rule.frame(s);
  },
  frame(s) {
    rule.sq(s, { z: -1 });
    rule.sq(s);
    rule.mem(s, { z: -1, rx: 90, y: 1 });
    rule.mem(s, { z: -1, rx: -90, y: -1 });
  },
  sq(s) {
    rule.mem(s);
    rule.mem(s, { rz: 90 });
  },
  mem(s) {
    CUBE(s, { s: [0.1, 1.1, 0.1], x: 5, z: 5 });
    CUBE(s, { s: [0.1, 1.1, 0.1], x: -5, z: 5 });
  }
};
structure(setup, rules);
return features;
};

features = ignitionFeatures(tokenData);


    } else if (projectId===10){
function to1(n){ return n/255 };
function to1N(n){ return n/128-1 };
function toNDecs(n, m){
  n = Math.round(n*(m*10))/(m*10)
  var a = n.toString().split('.');
  if ( a.length === 2 ){
    return Number(a[0]+'.'+a[1].substring(0,3));
  } else {
    return Number(n);
  }
}
function printf(s,a){
  var newS=s,i;
  for(i=0;i<a.length;i++){
    newS = newS.replace('%s',a[i]);
  }
  return newS;
}
function getNums(){
  var hashPairs=[],rvs,j=0;
  //let seed = parseInt(tokenData.hash.slice(0,16), 16);
  for (j=0; j<32; j++){
    hashPairs.push(tokenData.slice(2+(j*2),4+(j*2)));
  }
  rvs = hashPairs.map(n=>parseInt(n,16));
  return rvs;
}
function getWireData(){
     var c,i,/*d,*/y,data = {
         "red": 0, "green": 0, "blue": 0, "yellow": 0,
         "total": 0, "dangle":0, "hidden":0
     };
     for(i=0;i<cwires;i++){
         c = colors[nums[i]%colors.length];
         data[c]++;
         if ( nums[i]<85 ){
             y = to1N( nums[(i+2)%32] );
             if ( y<0 ) data.hidden++;
             data.dangle++;
         }
         data.total++;
     }
     return data;
 }
var colors = ["red","blue","green","yellow"];
var nums=getNums(),cblobs,brow/*,myp*/,mw,smile,fcolor;
var /*ed,*/browAng/*,pupOffs*/,stache,blush,blinkRate;
var SZ = Math.min(2400,2400);

cblobs = nums[0]%7+6;
let cwires = nums[0]%28+4;
let wiredata = getWireData();
brow = nums[2] <= 128;
//myp = toNDecs( to1(nums[3]), 3 );
mw = toNDecs( to1(nums[4])*(SZ/6.7), 3 );
smile = toNDecs( to1N(nums[5])*(SZ/20)*-1, 3 );
fcolor = colors[nums[6]%colors.length];
//ed = toNDecs( to1(nums[7])*(SZ/13.33), 3 );
browAng = toNDecs( to1N(nums[8])*45, 3 );
/*pupOffs = [
  toNDecs( to1N(nums[9]), 3 ),
  toNDecs( to1N(nums[10]), 3 )
];*/
stache = nums[12]<39;
blush = nums[15]<39;
blinkRate = toNDecs( (to1(nums[18])*10000+5000)/1000, 3 );

features.push( "Cloud Blobs: " + cblobs );
features.push( printf(
      "%s Wires / %s Dangling / %s Hidden",
      [ cwires, wiredata.dangle, wiredata.hidden ]
  ));
//features.push( printf("%s Wires / %s Dangling", [cwires,wiredata.dangle] ));
//features.push( printf( "%s Wires",[cwires]));
//features.push( "Mouth Y Position: " + myp);
features.push( "Mouth Width: " + Math.round(mw) );
features.push( "Face Color: " + fcolor );
features.push( "Smile Amount: " + Math.round(smile) );
features.push( "Blink Rate: " + Math.round(blinkRate) + " seconds" );
if (blush) features.push( "Blush Variant" );
//features.push( "Eye Distance: " + ed );
//features.push( "Eye Direction: " + pupOffs );
if (brow){
  features.push( "Eyebrow Angle: " + Math.round(browAng) );
} else {
  features.push( "No Eyebrows Variant" );
}
if (stache) features.push( "Mustache Variant" );

console.log( features.join('\n') );
} else if (projectId===11){


      let hashPairs = [];

      for (let j = 0; j < 32; j++) {
         hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)));
      }

      let decPairs = hashPairs.map(x => {
           return parseInt(x, 16);
      });

      let colorTypes = ["Gradient",
      "Rainbow",
      "None"
      ];

      let flipModes = ["None",
      "XFlip",
      "YFlip",
      "XYFlip",
      "Kaleido"
      ];

      let layers = Math.round(decPairs[0].map(0, 255, 1, 3));

      let cT = 0;
      if (decPairs[1 + layers + 2] % 50 === 1) {
        cT= 1;
      }
      if (decPairs[1 + layers + 8] % 25 === 3) {
        cT= 2;
     }

      let fM = 0;
      let mirror = Math.round(decPairs[1 + layers + 7].map(0, 255, 0.0, 5.0));
      if(mirror === 0.){
        fM = 1;
      }
      if(mirror === 1.){
        fM = 2;
      }

      if(mirror === 2.){
        fM = 3;
      }
      if(mirror === 3.){
        fM = 4;
      }

      var colorMode = colorTypes[cT];
      var flipMode = flipModes[fM];

      let colorBase = decPairs[1 + layers + 1];
      let speed = 0;
      let dimensions = 0;
      for (let i = 0; i < layers; i++) {

          dimensions += Math.round(decPairs[1 + i].map( 0, 255, 1, 6));
          speed += decPairs[1 + i].map(0, 255, 0.05, 0.5);

     }

      features = ["ColorMode: " + colorMode,
              "FlipMode: " + flipMode,
              "Layers: " + String(layers),
              "ColorBase(0-255): " + String(colorBase),
              "Speed: " + String(speed.toFixed(2)),
              "Dimension: " + String(dimensions)
            ]
          }

  return features;
}
