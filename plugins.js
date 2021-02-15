exports.features = (projectId, tokenData) => {
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  let features = [];
  let featuresReduced = [];

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
        featuresReduced.push("HyperRainbow");
      } else if (Math.floor(decPairs[26].map( 0, 255, 12, 20))===14 && Math.floor(decPairs[28].map(0,255,5,50))===11 && decPairs[22]>=32 && decPairs[31] >= 35) {
        features.push("Perfect Spectrum");
        featuresReduced.push("Perfect Spectrum");
      }





      if (decPairs[22]<32 && decPairs[31] < 35){
        features.push("Pipe");
        featuresReduced.push("Pipe");
        steps=50;
      } else if (decPairs[31] < 35){
        features.push("Slinky");
        featuresReduced.push("Slinky");
        steps=50;
      }
      if (decPairs[22]<32 && decPairs[31] >= 35){
        features.push("Fuzzy");
        featuresReduced.push("Fuzzy");
        steps=1000;
      }
      if (decPairs[23]<15){
        if (features.includes("Fuzzy")){

        } else if (!features.includes("Slinky") && !features.includes("Pipe")){
        features.push("Bold");
        featuresReduced.push("Bold");
      }
      }
      if (decPairs[24]<30){
        if (features.includes("Bold") || features.includes("Slinky") || features.includes("Fuzzy") || features.includes("Pipe")){
        } else {
        features.push("Ribbed (Color: "+decPairs[25]+")");
        featuresReduced.push("Ribbed");
      }
      }
      if (decPairs[22]>=32 && decPairs[31] >= 35){
        steps=200;
      }
      let startingColor=decPairs[29];
      let endingColor=decPairs[28] < 3?(decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/0.5)%255:Math.floor((decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/Math.floor(decPairs[28].map(0,255,5,50)))%255);
      let difference = function (a, b) { return Math.abs(startingColor - endingColor); };
      if (difference()<3 || difference()>252){
        if (!features.includes("Perfect Spectrum") && !features.includes("Fuzzy")){
          features.splice(0,0,"Full Spectrum");
          featuresReduced.splice(0,0,"Full Spectrum");
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
      featuresReduced.push("Complementary Variant");
    } else if (dec>239){
      features.push("Dark Variant");
      featuresReduced.push("Dark Variant");
    } else if (dec>226){
      features.push("Light Variant");
      featuresReduced.push("Light Variant");
    } else  {
      features.push("Standard Variant");
      featuresReduced.push("Standard Variant");
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
    featuresReduced.push(GetBlotTypeFromNumblots(numblobs));
    for (let i = 0; i < numblobs; i++) {
      getFillColor();
      features.push("Color: "+blotcolorname[i]);
      featuresReduced.push(blotcolorname[i]);
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

  featuresReduced = ["Palette: " + palette,
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

if (E) {
  features.push("Rare ETH version");
  featuresReduced.push("Rare ETH version");
}
if (R === 0.76) {
  features.push("Spread mode");
  featuresReduced.push("Spread mode");
}
else if (R === 1.52) {
  features.push("Super Spread mode");
  featuresReduced.push("Super Spread mode");
}
features.push((N === "d1" ? "Day" : "Night") + " mode");
featuresReduced.push((N === "d1" ? "Day" : "Night") + " mode");
if (M === false) {
  features.push("Monochrome mode");
  featuresReduced.push("Monochrome mode");
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
if (blush) {
  features.push( "Blush Variant" );
  featuresReduced.push( "Blush Variant" );
}

//features.push( "Eye Distance: " + ed );
//features.push( "Eye Direction: " + pupOffs );
if (brow){
  features.push( "Eyebrow Angle: " + Math.round(browAng) );
} else {
  features.push( "No Eyebrows Variant" );
  featuresReduced.push( "No Eyebrows Variant" );
}
if (stache) {
  features.push( "Mustache Variant" );
  featuresReduced.push( "Mustache Variant" );
}

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
      featuresReduced = ["ColorMode: " + colorMode,
              "FlipMode: " + flipMode
                  ]
          } else if (projectId===12){

                  let seed = parseInt(tokenData.slice(0, 16));
                  let chance = 0;

                  function rnd() {

                      seed ^= seed << 13;

                      seed ^= seed >> 17;

                      seed ^= seed << 5;

                      return (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000;
                  }

                  let colors = [
                      ['#0c0f0a', '#ff206e', '#fbff12', '#41ead4', '#ffffff'], // Cmyk
                      ['#000000', '#111111', '#232323', '#575757', '#7a7a7a'], // Obsidian
                      ['#ffffff', '#e3e3e3', '#aaaaaa', '#dbdbdb', '#e5e5e5'], // Diamond
                      ['#114b5f', '#1a936f', '#88d498', '#c6dabf', '#f3e9d2'], // Emerald
                      ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'], // Ruby
                      ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'], // Blue Amber
                      ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'], // Amethyst (Fluorite)
                      ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'], // Ocean Jasper
                      ['#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#6fffe9'], // Turquoise
                      ['#00296b', '#003f88', '#00509d', '#fdc500', '#ffd500'], // Labradorite
                      ['#000000', '#14213d', '#fca311', '#e5e5e5', '#ffffff'], // Sunset sodalite
                      ['#8dd635', '#8cff00', '#052233', '#093954', '#054f77'], // Amazonite
                      ['#562c2c', '#f2542d', '#f5dfbb', '#0e9594', '#127475'], // Ammolite
                      ['#011627', '#fdfffc', '#2ec4b6', '#e71d36', '#ff9f1c'], // CMKY Night
                  ];

                  function shuffle(array) {
                      var currentIndex = array.length, temporaryValue, randomIndex;

                      while (0 !== currentIndex) {

                          randomIndex = Math.floor(rnd() * currentIndex);
                          currentIndex -= 1;

                          temporaryValue = array[currentIndex];
                          array[currentIndex] = array[randomIndex];
                          array[randomIndex] = temporaryValue;
                      }

                      return array;
                  }

                  colors.forEach(function (c, i) {
                      colors[i] = shuffle(c);
                  })


                  const rCol = rnd();
                  var palletteName;
                  let colorPointer;
                  if (rCol < 0.03) { // 3 % chance Cmyk
                      colorPointer = 0;
                      palletteName = 'CMYK';
                      chance = 0.03;
                  } else if (rCol >= 0.03 && rCol < 0.08) { // 5 % chance Obsidian
                      colorPointer = 1;
                      palletteName = 'Obsidian';
                      chance = 0.05;
                  } else if (rCol >= 0.08 && rCol < 0.13) { // 5 % chance Diamond
                      colorPointer = 2;
                      palletteName = 'Diamond';
                      chance = 0.05;
                  } else if (rCol >= 0.13 && rCol < 0.19875) { // 6.875 % chance Emerald
                      colorPointer = 3;
                      palletteName = 'Emerald';
                      chance = 0.06875;
                  } else if (rCol >= 0.19875 && rCol < 0.2675) { // 6.875 % chance Ruby
                      colorPointer = 4;
                      palletteName = 'Ruby';
                      chance = 0.06875;
                  } else if (rCol >= 0.2675 && rCol < 0.33625) { // 6.875 % chance Blue Amber
                      colorPointer = 5;
                      palletteName = 'Blue Amber';
                      chance = 0.06875;
                  } else if (rCol >= 0.33625 && rCol < 0.405) { // 6.875 % chance Fluorite
                      colorPointer = 6;
                      palletteName = 'Fluorite';
                      chance = 0.06875;
                  } else if (rCol >= 0.405 && rCol < 0.49) { // 8.5 % chance Ocean Jasper
                      colorPointer = 7;
                      palletteName = 'Ocean Jasper';
                      chance = 0.085;
                  } else if (rCol >= 0.49 && rCol < 0.575) { // 8.5 % chance Turquoise
                      colorPointer = 8;
                      palletteName = 'Turquoise';
                      chance = 0.085;
                  } else if (rCol >= 0.575 && rCol < 0.66) { // 8.5 % chance Labradorite
                      colorPointer = 9;
                      palletteName = 'Labradorite';
                      chance = 0.085;
                  } else if (rCol >= 0.66 && rCol < 0.745) { // 8.5 % chance Sunset sodalite
                      colorPointer = 10;
                      palletteName = 'Sunset sodalite';
                      chance = 0.085;
                  } else if (rCol >= 0.745 && rCol < 0.83) { // 8.5 % chance Amazonite
                      colorPointer = 11;
                      palletteName = 'Amazonite';
                      chance = 0.085;
                  } else if (rCol >= 0.83 && rCol < 0.915) { // 8.5 % chance Ammolite
                      colorPointer = 12;
                      palletteName = 'Ammolite';
                      chance = 0.085;
                  } else { // 8.5 % chance Cmyk night
                      colorPointer = 13;
                      palletteName = 'CMYK night';
                      chance = 0.085;
                  }


                  const numColRnd = rnd();
                  let numColors;
                  if (numColRnd < 0.1) { // 10 % chance 2 colors
                      numColors = 2;
                      chance *= 0.1;
                  } else if (numColRnd >= 0.1 && numColRnd < 0.3) { // 20 % chance 3 colors
                      numColors = 3;
                      chance *= 0.2;
                  } else if (numColRnd >= 0.3 && numColRnd < 0.5) { // 20 % chance 4 colors
                      numColors = 4;
                      chance *= 0.2;
                  } else { // 50 % chance 5 colors
                      numColors = 5;
                      chance *= 0.5;
                  }

                  function genColor() {
                      let col = '';
                      col = colors[colorPointer][parseInt((rnd() * (numColors - 1)).toFixed(0))]
                      return col;
                  }

                  function genArc() {
                      const col1 = genColor()


                      const rotArc = genArc ? rnd() : 0;
                  }


                  function genTri() {

                      const col1 = genColor()


                      const rot = rnd();
                  }

                  var letcolor = null;
                  let letters = ''

                  function genLetter(row, col, colbg) {
                      letcolor = letcolor ? letcolor : genColor()

                      while (colbg === letcolor) {
                          letcolor = genColor();
                      }


                      letters += String.fromCharCode(rnd() * 25 + 65);

                  }

                  var numColsAndRows;
                  var rs = rnd();
                  if (rs >= 0 && rs < 0.3) { // 30 % chance 5x5
                      numColsAndRows = 5;
                      chance *= 0.3;
                  } else if (rs >= 0.3 && rs < 0.55) { // 25 % chance 10x10
                      numColsAndRows = 10;
                      chance *= 0.25;
                  } else if (rs >= 0.55 && rs < 0.80) { // 25 % chance 15x15
                      numColsAndRows = 15;
                      chance *= 0.25;
                  } else { // 20 % chance 20x20
                      numColsAndRows = 20;
                      chance *= 0.2;
                  }


                  const letbg = genColor()

                  const shape = rnd();

                  if (shape < 0.075) { // 7.5 % chance Wave
                      chance *= 0.075
                  } else if (shape >= 0.075 && shape < 0.15) { // 7.5 % chance Angled
                      chance *= 0.075
                  } else if (shape >= 0.15 && shape < 0.65) { // 50 % chance Fifty-Fifty
                      chance *= 0.5
                  } else if (shape >= 0.65 && shape < 0.825) { // 17.5 % chance Wavy-up
                      chance *= 0.175
                  } else { // 17.5 % chance Angled-up
                      chance *= 0.175
                  }


                  var shapeName;

                  for (let i = 1; i <= Math.pow(numColsAndRows, 2); i++) {
                      var row = Math.ceil(i / numColsAndRows);

                      var col = i - (row - 1) * numColsAndRows;
                      let bgcol = genColor();


                      if (i > (Math.pow(numColsAndRows, 2) - 3)) {
                          genLetter(row, col, letbg);
                      }


                      var r = rnd();
                      if (shape < 0.075) { // 7.5 % chance Wave
                          shapeName = 'Wave';
                          genArc();
                      } else if (shape >= 0.075 && shape < 0.15) { // 7.5 % chance Angled
                          shapeName = 'Angled';
                          genTri();
                      } else if (shape >= 0.15 && shape < 0.65) { // 50 % chance Fifty-Fifty
                          shapeName = 'Fifty-Fifty';
                          if (r >= 0.5) {
                              genArc();
                          } else {
                              genTri();
                          }
                      } else if (shape >= 0.65 && shape < 0.825) { // 17.5 % chance Wavy-up
                          shapeName = 'Wavy-up';
                          if (r >= 0.25) {
                              genArc();
                          } else {
                              genTri();
                          }
                      } else { // 17.5 % chance Angled-up
                          shapeName = 'Angled-up';
                          if (r >= 0.25) {
                              genTri();
                          } else {
                              genArc();
                          }
                      }


                  }

                  const rhmusic = rnd();


                  const rmusic = rnd();
                  let  beatName;
                  if (rmusic >= 0 && rmusic < 0.125) {
                      beatName = 'Beat1';
                  } else if (rmusic >= 0.125 && rmusic < 0.25) {
                      beatName = 'Beat2';
                  } else if (rmusic >= 0.25 && rmusic < 0.375) {
                      beatName = 'Beat3';
                  } else if (rmusic >= 0.375 && rmusic < 0.5) {
                      beatName = 'Beat4';
                  } else if (rmusic >= 0.5 && rmusic < 0.625) {
                      beatName = 'Beat5';
                  } else if (rmusic >= 0.625 && rmusic < 0.75) {
                      beatName = 'Beat6';
                  } else if (rmusic >= 0.75 && rmusic < 0.875) {
                      beatName = 'Beat7';
                  } else {
                      beatName = 'Beat8';
                  }
                  chance *= 0.125;

                  var frq = rnd() * 1.25;

                  while (frq < 0.75) { // means between 0.75 and 1.25
                      frq = rnd() * 1.25;
                  }


              features = [
                  "Palette: " + palletteName,
                  "# of colors: " + String(numColors),
                  "Grid size: " + String(numColsAndRows + 'x' + numColsAndRows),
                  "Shape: " + shapeName,
                  "Beat: " + beatName
              ]

              featuresReduced = [
                  "Palette: " + palletteName,
                  "# of colors: " + String(numColors),
                  "Grid size: " + String(numColsAndRows + 'x' + numColsAndRows),
                  "Shape: " + shapeName,
                  "Beat: " + beatName
              ]
          } else if (projectId===13){
            // class needed for ringer
          class DeadRinger {
          constructor(points) {
          this.points = points
          }

          generate(wrap, forceCentroid, shouldSort) {
          let centroid

          if (forceCentroid) {
          centroid = [forceCentroid[0], forceCentroid[1]]
          } else {
          centroid = [0,0]
          this.points.forEach(i=> {
          centroid[0] += i.cx
          centroid[1] += i.cy
          })
          centroid = [centroid[0]/this.points.length, centroid[1]/this.points.length]
          }

          if (shouldSort) {
          this.points.sort((a,b) => {
          let aAng = Math.atan2(a.cy - centroid[1], a.cx - centroid[0])
          let bAng = Math.atan2(b.cy - centroid[1], b.cx - centroid[0])

          let angleDifference = (aAng - bAng) % (Math.PI * 2)
          let spaceDifference = -(distance(a.cx, a.cy, centroid[0], centroid[1]) - distance(b.cx, b.cy, centroid[0], centroid[1]))

          let zeroAngleDifference = Math.abs(angleDifference) < 0.0001
          let zeroSpaceDifference = Math.abs(spaceDifference) < 0.0001

          let qualifier = zeroAngleDifference ? spaceDifference : angleDifference
          let result = (zeroAngleDifference && zeroSpaceDifference) ? (a.id - b.id) : qualifier
          return result
          })
          }

          for (let i=0; i < this.points.length && this.points.length > 1; i+=1) {

          let prev = this.points[i-1 < 0 ? this.points.length - 1 : i-1 ]

          let current = this.points[i]
          current.sortedOrder = i

          let next = this.points[(i+1) % this.points.length]

          let dAx = prev.cx - current.cx;
          let dAy = prev.cy - current.cy;
          let dBx = next.cx - current.cx
          let dBy = next.cy - current.cy;

          var ang = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)
          current.isConcave = (ang < 0 && Math.abs(ang) <= Math.PI) ||  Math.abs(Math.abs(ang) - Math.PI) < 0.0001
          }
          }
          }

          let rawParams = setupParametersFromTokenData(tokenData)
          // we may need to rename?
          let seed = generateSeedFromTokenData(tokenData)

          let GRID_ALGORITHM = 0
          let RECURSIVE_GRID_ALGORITHM = 1
          let CONSTANT_RADIUS = 0
          let BIGGER_NEAR_CENTER_RADIUS = 1
          let BIGGER_FAR_CENTER_RADIUS = 2

          //let tokenId = parseInt(tokenData.tokenId.substring(2))

          let params = {
          gridDimension: parseInt(mapParam(rawParams[0], 3, 6)),
          radius: mapParam(rawParams[1], 0.5, 0.8),
          sampleRate: mapParam(rawParams[2], 0.5, 0.8),
          wrapped: rawParams[3] < 127,
          drawAllPoints: rawParams[4] < 127,
          forceCentroid: rawParams[5] > 200,
          fill: rawParams[6] < 127,
          pointsAlgorithm: rawParams[7] < 220 ? GRID_ALGORITHM: RECURSIVE_GRID_ALGORITHM,
          variableRadius: rawParams[8] > 200 ? (rawParams[8] > 227 ? BIGGER_NEAR_CENTER_RADIUS : BIGGER_FAR_CENTER_RADIUS) : CONSTANT_RADIUS,
          backgroundHighlight: rawParams[9] > 220,
          fillHighlight: rawParams[10] > 220,
          useSecondaryColor: rawParams[11] < 75,
          useSecondaryColorForBackground: rawParams[12] > 170,
          concentric: (rawParams[13] <= 13) || (rawParams[13] > 108 && rawParams[13] <= 110) || (rawParams[13] === 69) || (rawParams[13] === 33)||(rawParams[13] === 43),
          flipConcaveColor: rawParams[14] > 200 && (rawParams[6] >= 127 || rawParams[10] > 220),
          backgroundColor: rawParams[22] < 250 ? '#f5f5f5': '#2b2b2b',
          subtleBackgroundColor: '#f7f7e6',
          strokeColor: rawParams[22] < 250 ? '#2b2b2b' : '#f5f5f5',
          highlightColor: rawParams[22] < 250 ?'#f2c945': '#2b2b2b',
          secondaryColor: (rawParams[15] >= 19 && rawParams[15] <= 230) ? '#c3423f' : (rawParams[15] > 230 && rawParams[15] <= 234 ? '#3b9764': '#4381c1'),
          useSecondaryColorForFill: rawParams[16] <= 85,
          strokeWeight: 8,
          padding: (rawParams[17] > 14 ? 1 : 2.66),
          shrinkConcavePegs: rawParams[18] >= 245,
          useSubtleBackground: rawParams[19] >= 245,
          offsetGrid: rawParams[7] < 220 && rawParams[20] > 205,
          offsetGridStarting: rawParams[21] > 127
          }

          // where the magic happens, this is very sensitive so be careful
          calculateFeatures()

          // The features array now is filled
          console.log(features)

          // Function to calculate features

          function calculateFeatures() {

          let dimWidth = 1200
          let dimHeight = dimWidth

          //let strokeWidth = params.strokeWeight * dimWidth/800
          let highlightBackgroundPick = params.useSecondaryColorForBackground ? params.secondaryColor : params.highlightColor
          let actualBackgroundColor = params.backgroundHighlight ? highlightBackgroundPick : (params.useSubtleBackground ? params.subtleBackgroundColor : params.backgroundColor)
          features.push("Background: " +hexToName(actualBackgroundColor))
          featuresReduced.push("Background: " +hexToName(actualBackgroundColor))

          let padding = dimWidth * params.padding * 0.08
          features.push("Size: " + (params.padding === 1 ? 'Normal' : 'smol boi'))
          featuresReduced.push("Size: " + (params.padding === 1 ? 'Normal' : 'smol boi'))
          let innerWidth = dimWidth - 2*padding
          let innerHeight = dimHeight - 2*padding

          let cellDimension = innerWidth/params.gridDimension

          let points = []

          let sampleRate = params.sampleRate

          let centroid = params.forceCentroid ? [range(0, cellDimension*2), range(dimHeight/2, dimHeight)] : false
          let wrapped = params.wrapped

          features.push('Wrap orientation: '+ (centroid ? 'Off-center' : 'Balanced'))
          featuresReduced.push('Wrap orientation: '+ (centroid ? 'Off-center' : 'Balanced'))

          features.push('Wrap style: '+ (wrapped ? 'Weave' : 'Loop'))
          featuresReduced.push('Wrap style: '+ (wrapped ? 'Weave' : 'Loop'))

          if (params.pointsAlgorithm === GRID_ALGORITHM) {
          points = pointsOnGrid(points, padding, cellDimension)
          if (!params.offsetGrid) {
          features.push('Peg layout: ' +params.gridDimension+'x'+ params.gridDimension+' grid')
          featuresReduced.push('Peg layout: ' +params.gridDimension+'x'+ params.gridDimension+' grid')
          } else {
          features.push('Peg layout: Tiled ' + (params.gridDimension - (params.offsetGridStarting ? 0: 1)) +','+ (params.gridDimension - (params.offsetGridStarting ? 1: 0) ))
          featuresReduced.push('Peg layout: Tiled ' + (params.gridDimension - (params.offsetGridStarting ? 0: 1)) +','+ (params.gridDimension - (params.offsetGridStarting ? 1: 0) ))
          }
          } else if (params.pointsAlgorithm === RECURSIVE_GRID_ALGORITHM) {
          pointsOnRecursiveGrid(points, padding, padding, innerWidth, innerHeight)
          features.push('Peg layout: Recursive grid')
          featuresReduced.push('Peg layout: Recursive grid')
          }

          if (params.variableRadius !== CONSTANT_RADIUS) {
          let biggerCenter = params.variableRadius === BIGGER_NEAR_CENTER_RADIUS
          if (biggerCenter) {
          features.push('Peg scaling: Bigger near center')
          } else {
          features.push('Peg scaling: Smaller near center')
          }

          points.forEach((p,i) => {
          let distanceToCenter = distance(dimWidth/2, dimHeight/2, p.cx, p.cy)
          let biggerCenterCoefficient = 1 / (1 + distanceToCenter/(dimWidth/5))
          let smallerCenterCoefficient = (1 + distanceToCenter + cellDimension) / distance(dimWidth/2, dimHeight/2, 0, 0)
          let coefficient = range(0.8, 1) * (biggerCenter ? biggerCenterCoefficient : smallerCenterCoefficient)
          p.r *= coefficient
          })
          } else {
          features.push('Peg scaling: Uniform')
          }

          let {samples, leftOver} = sampleSize(points, parseInt(sampleRate * points.length))

          let ringer = new DeadRinger(samples)

          ringer.generate(wrapped, centroid, true)

          let bodyFillColor

          if (params.fill){
          let fillHighlightColor = params.useSecondaryColorForFill ? params.secondaryColor : params.highlightColor
          bodyFillColor = params.fillHighlight ? fillHighlightColor : params.strokeColor
          } else {
          bodyFillColor = params.backgroundColor
          }

          features.push("Body: " +hexToName(bodyFillColor))
          featuresReduced.push("Body: " +hexToName(bodyFillColor))


          rangeFloor(0, samples.length)

          if (params.concentric) {
          features.push('Peg style: Bullseye')
          featuresReduced.push('Peg style: Bullseye')
          } else {
          features.push('Peg style: Solid')
          featuresReduced.push('Peg style: Solid')
          }

          if (params.drawAllPoints) {
          rangeFloor(0, leftOver.length)
          //let unusedPegFill = (params.flipConcaveColor ? params.strokeColor : params.backgroundColor)
          if (params.useSecondaryColor) {
          features.push('Extra color: '+hexToName(params.secondaryColor))
          featuresReduced.push('Extra color: '+hexToName(params.secondaryColor))
          } else {
          features.push('Extra color: N/A')
          featuresReduced.push('Extra color: N/A')
          }
          } else {
          features.push('Extra color: N/A')
          featuresReduced.push('Extra color: N/A')
          }

          features.push('Peg count: '+ (params.drawAllPoints ? points.length : samples.length))
          }

          /**
          * Helper functions
          */

          function hexToName (hexString) {
          let colMap = {
          '#f5f5f5': 'White',
          '#2b2b2b': 'Black',
          '#f7f7e6': 'Beige',
          '#f2c945': 'Yellow',
          '#c3423f': 'Red',
          '#4381c1': 'Blue',
          '#3b9764': 'Green'
          }

          return colMap[hexString]
          }

          function pointsOnGrid(points, padding, cellDimension) {
          for (let i = 0; i < params.gridDimension; i++) {
          let boolFunction = params.offsetGridStarting ? (i%2 !== 0) : (i%2 === 0)
          let offsetter = params.offsetGrid ? (boolFunction ? 1: 0) : 0

          for (let j = 0; j < params.gridDimension - offsetter; j++) {
          let cx = padding + (i+0.5) * cellDimension;
          let cy = padding + (j+0.5 + offsetter/2) * cellDimension;
          let r = cellDimension/2 * params.radius
          points.push({cx, cy, r, originalR: r, i, j, id: points.length})
          }
          }
          return points
          }

          function pointsOnRecursiveGrid(points, x, y, w, h, iter=1) {
          let dimW = parseInt(range(2,4))
          let dimH = dimW

          let nw = w/dimW
          let nh = h/dimH

          for (let nx=x; nx < x+w-1; nx+=nw) {
          for (let ny=y; ny <y+h-1; ny+=nh) {
          if (rnd() < 0.5 && iter < 2) {
          pointsOnRecursiveGrid(points, nx, ny, nw, nh, iter+1)
          } else {
          let r = params.radius*Math.min(nw,nh)/2
          points.push({r, cx: nx+nw/2, cy: ny+nh/2, originalR: r, id: points.length})
          }
          }
          }
          }

          // parse parameters
          function setupParametersFromTokenData(token) {
          let hashPairs = []
          //parse hash
          for (let j = 0; j < 32; j++) {
          hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)))
          }
          // map to 0-255
          return hashPairs.map(x => {
          return parseInt(x, 16)
          })
          }

          function generateSeedFromTokenData(token) {

          return parseInt(tokenData.slice(0, 16), 16)
          }

          function rnd() {
          seed ^= seed << 13
          seed ^= seed >> 17
          seed ^= seed << 5

          let result = (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000
          return result
          }

          function range (min, max) {
          if (max === undefined) {
          max = min;
          min = 0;
          }

          return rnd() * (max - min) + min;
          }

          function rangeFloor (min, max) {
          if (max === undefined) {
          max = min
          min = 0
          }
          return Math.floor(range(min, max))
          }

          function shuffleArray (arr) {
          var rand;
          var tmp;
          var len = arr.length;
          var ret = arr.slice();
          while (len) {
          rand = Math.floor(rnd() * len--);
          tmp = ret[len];
          ret[len] = ret[rand];
          ret[rand] = tmp;
          }
          return ret;
          }

          function distance (x1, y1, x2, y2) {
          return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
          }

          function sampleSize(arr, num) {
          if (!Array.isArray(arr)) {
          throw new TypeError('Expected Array, got ' + typeof arr);
          }

          if (arr.length < num) {
          throw new TypeError('Array is has less elements than sample size, ' + arr.length + ' vs '+num);
          }

          let shuffled = shuffleArray(arr)

          return {samples: shuffled.slice(0, num), leftOver: shuffled.slice(num)}
          }

          function mapd(n, start1, stop1, start2, stop2) {
          return ((n-start1)/(stop1-start1))*(stop2-start2)+start2
          }

          function mapParam(n, start, stop) {
          return mapd(n, 0, 255, start, stop)
          }
          }

          else if (projectId===14){
            let seed = parseInt(tokenData.slice(0, 16), 16);

            class Palette {
              constructor(colors, repeat=3) {
                this.c = colors;
                this.repeat = repeat;
                this.i = 0;
                this.u = 0;
              }
              increment() {
                if (this.i === this.c.length-1) {
                  this.i = 0;
                } else {
                  this.i += 1;
                }
              }
              usage() {
                if (this.u % this.repeat === 0) {
                  this.increment();
                }
                this.u += 1;
              }
              color() {
                this.usage();
                return this.c[this.i];
              }
            }

            class Ship {
              constructor() {
                this.objects = [];
                this.dyn = false;
                this.push = 0;
                this.speed = 0;
              }
            }

            var DEFAULT_SIZE = 1000;
            var WIDTH = 2400;
            var HEIGHT = 2400;
            var DIM = Math.min(WIDTH, HEIGHT);
            var M = DIM / DEFAULT_SIZE;

            var PALS = [["#F72585", "#B5179E", "#7209B7", "#4361EE", "#4361EE", "#4895EF", "#4CC9F0"],
            ["#FF184C", "#FF184C", "#0A9CF5"],
            ["#E92EFB", "#FF2079", "#440BD4", "#04005E"],
            ["#08F7FE", "#09FBD3", "#FE53BB", "#F5D300"],
            ["#D9EB4B", "#00A9FE", "#FD6BB6", "#EF0888"],
            ["#3B27BA", "#E847AE", "#13CA91", "#FF9472"],
            ["#E96D5E", "#EEEEEE", "#FFE69D", "#6A7E6A", "#393F5F"],
            ["#63345E", "#FD8090", "#B7C1DE", "#06569C", "#092047"]];

            var PAL_C = rnd_choice([0,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7]);
            var PAL = PALS[PAL_C];
            var REP = rnd_choice([2,3,3,3,3,4,5,6,7,8,9,10,15,20,30,50,100]);
            var P1 = new Palette(PAL, REP);
            var max_h = rnd_between(10, 50)*M;
            var max_w = rnd_between(10, 50)*M;
            var dyn_true = rnd_between(0, 1) > 0.5;
            var dyn_thresh = rnd_between(0.5, 1);
            var Ships = [];

            let travelers = [];
            rr(0, 0, DIM, DIM);
            for (let s of Ships) {
              if (s.speed > 0) {
                travelers.push(s.speed);
              }
            }

            function rr(x, y, w, h) {
              if (rnd_between(0, 0.55) > 0.5) {
                rect_partition(x, y, x+w, y+h);
              }
              let sw = rnd_between(0, 0.7) > 0.5;
              let sl = rnd_between(0.1, 0.8);
              if (sw && w > max_w) {
                rr(x, y, w * sl, h);
                rr(x + (w * sl), y, w * (1 - sl), h);
              } else if (h > max_h) {
                rr(x, y, w, h * sl);
                rr(x, y + (h * sl), w, h * (1 - sl));
              }
            }
            function rescale(e, t, r, i, a) {
              return ((e - t) / (r - t)) * (a - i) + i;
            }
            function range(start, stop, step) {
                var a = [start], b = start;
                while (b < stop) {
                    a.push(b += step || 1);
                }
                return (b > stop) ? a.slice(0,-1) : a;
            }
            function rect_partition(x1, y1, x2, y2) {
              let ship = new Ship();
              let sw = rnd_between(1, 15)*M;
              let dyn = rnd_choice([false,true,true]);
              let step = 15*M;
              let breaks = range(x1, x2, step).slice(rnd_between(1,5));
              ship.objects.push({x:x1, y:y1, xs:(x2-x1), ys:(y2-y1), c:P1.color(), sw:sw, dyn:dyn, tl:0});
              let height = y2-y1;
              for (let xm of breaks) {
                ship.objects.push({x:x1, y:y1, xs:(xm-x1), ys:(y2-y1), c:P1.color(), sw:sw, dyn:dyn, tl:0});
                x1 = xm;
              }
              if (height < 25*M && sw < 5*M && dyn_true && rnd_between(0, 1) < dyn_thresh) {
                ship.dyn = true;
                ship.speed = (1-rescale(height, 0, 25*M, 0.7, 0.9))*M;
              }
              Ships.push(ship);
            }
            function rnd_dec() {
              seed ^= seed << 13
              seed ^= seed >> 17
              seed ^= seed << 5
              return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000
            }
            function rnd_between(a, b) {
              return a + (b - a) * rnd_dec()
            }
            function rnd_choice(choices) {
              return choices[Math.floor(rnd_between(0, choices.length * 0.99))]
            }

            var PALS_N = ["Cyber","Azure","Viper","Neopunk","Sentinel","Eternity","Voyage","Essence"];
            function cat(input, values, outcome, fallback) {
              var zip = (a, b) => a.map((x, i) => [x, b[i]]);
              for (let [a, b] of zip(values, outcome))
                if (input >= a) {
                  return b;
                }
              return fallback;
            }

            features = [
              "Palette:" + PALS_N[PAL_C],
              "Components:" +
                cat(
                  Ships.length,
                  [700, 500, 250, 100],
                  ["700+", "500-699", "250-499", "100-249"],
                  "0-99"
                ),
              "State:" + cat(travelers.length, [1], ["Dynamic"], "Static"),
              "Ships:" +
                cat(
                  travelers.length,
                  [50, 25, 10, 1],
                  ["50+", "25-49", "10-24", "1-10"],
                  "0"
                ),
              "Color Repeat:" + REP
            ];

            console.log(features)

featuresReduced = [
  "Palette:" + PALS_N[PAL_C],
  "Components:" +
    cat(
      Ships.length,
      [700, 500, 250, 100],
      ["700+", "500-699", "250-499", "100-249"],
      "0-99"
    ),
  "State:" + cat(travelers.length, [1], ["Dynamic"], "Static"),
  "Ships:" +
    cat(
      travelers.length,
      [50, 25, 10, 1],
      ["50+", "25-49", "10-24", "1-10"],
      "0"
    )
];

            //console.log(features)
          }

          else if (projectId===15){

              const utopiaFeatures = (hash) => {
            	let features = [],
            		RandomGenerator = function (s) {
            			let seedA = s;
            			return function () {
            				seedA ^= seedA << 13;
            				seedA ^= seedA >> 17;
            				seedA ^= seedA << 5;
            				return ((seedA < 0 ? ~seedA + 1 : seedA) % 1000) / 1000;
            			};
            		},
            		random = RandomGenerator(parseInt(hash.slice(0, 16), 16)),
            		randint = (s, e = 0) => {
            			if (e === 0) {
            				e = s;
            				s = 0;
            			}
            			return Math.floor(s + random() * (e - s + 1));
            		},
            		randpos = (a) => {
            			return a[Math.floor(random() * a.length)];
            		};
            		random();
            		let sky = randpos([
            			["Black & White", "Day"],
            			["Yellow", "Day"],
            			["Green", "Day"],
            			["Orange", "Day"],
            			["Orange", "Day"],
            			["Neon", "Day"],
            			["Blue", "Day"],
            			["Purple", "Day"],
            			["Grey", "Night"],
            			["Orange", "Night"],
            			["Blue", "Night"],
            			["Green", "Night"],
            			["Cyan", "Night"],
            			["Sepia", "Night"],
            			["Purple", "Night"],
            			["Yellow", "Dawn"],
            			["Orange", "Dawn"],
            			["Blue", "Dawn"],
            			["Sepia", "Dawn"],
            			["Black", "Night"]
            		]),
            		skyCol = sky[0],
            		time = sky[1],
            		structList = [
            			"Pyramid",
            			"Ether",
            			"Skyscraper",
            			"Laser tower",
            			"Nuclear plant",
            			"Generator"
            		],
            		struct = randint(5),
            		ufo = random() > 0.95 ? 1 : 0,
            		spa = random() > 0.95 ? 1 : 0;
            	if (struct === 5) ufo = 0;
            	features.push("Sky color: " + skyCol);
              featuresReduced.push("Sky color: " + skyCol);
            	features.push("Time: " + time);
              featuresReduced.push("Time: " + time);
            	features.push("Structure: " + structList[struct]);
              featuresReduced.push("Structure: " + structList[struct]);
            	if (ufo) {
                features.push("UFO");
                featuresReduced.push("UFO");
              }
            	if (struct === 0 && spa) {
                featuresReduced.push("Aliens contamination");
              }
            	return features;
            };


            /////////////////////////////////////////////////////////////////////


            features = utopiaFeatures(tokenData);
            console.log(features)

            }

            ///////

            else if (projectId===16){


                let hashPairs = [];
                for (let i = 0; i < 32; i++) {
                	let hex = tokenData.slice((2 * i) + 2, (2 * i) + 4);
                	hashPairs[i] = parseInt(hex, 16);
                }
                let albers, rndcolor, blackcorner, tinted, hline, vline, circles = false;
                let divs = [3, 4, 4, 5, 5, 6, 6, 6, 8, 8, 8, 10, 10, 10, 12, 12, 12, 15, 15, 15, 20, 20, 20, 24, 24, 24, 30, 30, 30, 40, 40, 60, 60, 120];
                let hdiv, vdiv;
                hdiv = divs[Math.floor(hashPairs[0].map(0, 255, 0, divs.length - .0000000001))];
                vdiv = divs[Math.floor(hashPairs[1].map(0, 255, 0, divs.length - .0000000001))];


                for (let i = 0; i < 61; i++) {
                	let hexquad = tokenData.slice(i + 2, i + 6);
                	if (hexquad === 'a1be' || hexquad === 'a1b3') {
                		albers = true;
                	}
                }
                if (albers) {
                	//append(features, 'Albers')
                  features.push('Albers');
                  featuresReduced.push('Albers');
                }
                if (hashPairs[14] > 250 && !albers) {
                	rndcolor = true;
                	//append(features, 'Random')
                  features.push('Random');
                  featuresReduced.push('Random');
                }
                if (hashPairs[14] > 244 && !rndcolor && !albers) {
                	//complementary = true;
                	//append(features, 'Complementary')
                  features.push('Complementary');
                  featuresReduced.push('Complementary');
                }
                if (hashPairs[15] > 248 && !rndcolor && !albers) {
                	blackcorner = true;
                	//append(features, 'Black Corner')
                  features.push('Black Corner');
                  featuresReduced.push('Black Corner');
                }
                if (hashPairs[15] > 225 && !blackcorner && !rndcolor && !albers) {
                	tinted = true;
                	//append(features, 'Tinted')
                  features.push('Tinted');
                  featuresReduced.push('Tinted');
                }
                if (hashPairs[15] > 202 && !tinted && !blackcorner && !rndcolor && !albers) {
                	//saturated = true;
                	//append(features, 'Saturated')
                  features.push('Saturated');
                  featuresReduced.push('Saturated');
                }
                if (hdiv === vdiv && !albers) {
                	if (hashPairs[29] > 127) {
                		circles = true;
                		//append(features, 'Circles')
                    features.push('Circles');
                    featuresReduced.push('Circles');
                	}
                }
                //let hline,vline;
                if (hashPairs[30] > 191 && !circles) {
                	hline = true;
                }
                if (hashPairs[31] > 191 && !circles) {
                	vline = true;
                }
                if (!hline && !vline) {
                	//append(features, 'Adjacent')
                  features.push('Adjacent');
                  featuresReduced.push('Adjacent');
                }
                if (hline && !vline) {
                	//append(features, 'Horizontal Lines')
                  features.push('Horizontal Lines');
                  featuresReduced.push('Horizontal Lines');
                }
                if (vline && !hline) {
                	//append(features, 'Vertical Lines')
                  features.push('Vertical Lines');
                  featuresReduced.push('Vertical Lines');
                }
                if (hline && vline) {
                	//append(features, 'Grid Lines')
                  features.push('Grid Lines');
                  featuresReduced.push('Grid Lines');
                }

              }

              ////////


              else if (projectId===17){

                  const getFromHash = h => {
                      h = h.substr(2);
                      let table = [];
                      for (let i = 0; i < 16; i++) { table[i] = parseInt("0x"+(h.substr(i+8, 1) + h.substr(i+24, 1) + h.substr(i+40, 1)),16)/4096; }
                      return table;
                  }
                  const values = getFromHash(tokenData);
                  const E = value => { return Math.floor(value+0.5); }
                  const SF = (value, minRange, maxRange) => { return Math.floor(((value*(maxRange-minRange))+minRange)+0.5); }
                  const S = (value, minRange, maxRange) => { return (value*(maxRange-minRange))+minRange; }
                  const sh = v => { return  Number.parseFloat(v).toFixed(3); }
                  const isMonotone = (v) => {
                      let monotone = false;
                      // If the palette is set to monotone then *it is* monotone
                      if (!E(((values[12]+values[15])*0.5)+0.2)) { monotone = true; }
                      // v[2] || v[3] might be -1, in case just exclude them
                      let colors = [v[0], v[1]];
                      if (v[2] >= 0) { colors.push(v[2]); }
                      if (v[3] >= 0) { colors.push(v[3]); }
                      // Otherwise we need to check for color similarities
                      let center = 0.41;
                      // Check if all under center
                      if (colors.every((v) => v <= center)) { monotone = true };
                      // Check if all over center
                      if (colors.every((v) => v > center)) { monotone = true };
                      return monotone;
                  }
                const metadata = {};
                // Orientation
                metadata.orientation = E(values[12]-0.35) ?
                  E(values[10]) ? "Horizontal" : "Vertical"
                : E(values[10]) ?  "Vertical" : "Horizontal";
                features.push("Orientation: " + metadata.orientation);
                featuresReduced.push("Orientation: " + metadata.orientation);

                // Palette
                if (E(((values[12]+values[15])*0.5)+0.2)) {
                  if (E(values[11]-0.25) == 1) {
                    metadata.palette = "Purple-Yellow";
                  } else {
                    if (S(values[5],0., 0.07) < 0.03) {
                      metadata.palette = "Coral-Teal";
                    } else {
                      metadata.palette = "Pink–Mint";
                    }
                  }
                }
                let colors = [values[7], values[6], values[9], values[2]];
                  // If LFO is off, the color will just be black.
                  if (E(values[12]-0.4)) { colors[2] = -1 };
                  // If brightness is very low, the color will just look like black.
                  if ((1 - Math.abs(values[6]-0.45)) >= 0.85) { colors[3] = -1 };
                if (isMonotone(colors)) { metadata.palette = "Monotone" };
                features.push("Palette: " + metadata.palette);
                featuresReduced.push("Palette: " + metadata.palette);

                // Modulation frequency
                let mf = SF(values[2], 1., 35.);
                if (mf < 8) {
                  metadata.modulation_frequency = "Low";
                } else if (mf >= 8 && mf < 15) {
                  metadata.modulation_frequency = "Medium";
                } else if (mf >= 15) {
                  metadata.modulation_frequency = "High";
                }
                features.push("Frequency modulation: " + metadata.modulation_frequency);
                featuresReduced.push("Frequency modulation: " + metadata.modulation_frequency);

                // Bitwise operators
                if (E(values[11]) && E(values[3]+0.1)) {
                  metadata.bitwise = "OR";
                } else if (!E(values[11]) && !E(values[3]+0.1)) {
                  metadata.bitwise = "AND";
                } else {
                  metadata.bitwise = "Mixed";
                }
                features.push("Bitwise operators: " + metadata.bitwise);
                featuresReduced.push("Bitwise operators: " + metadata.bitwise);

              }


            ///////


            else if (projectId===18){
              let hp = [];
let hashstring = "";
let sprite = false;
let monochrome = false;
let rainbow = false;
let log_features = false;


function mapperz(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
}

function floor(num) {
  return Math.floor(num);
}

function unhex(n) {
    return parseInt(`0x${n}`, 16);
}

hashstring = tokenData.substring(2)
for (let i = 0; i < hashstring.length / 2; i++) {
  hp[i] = unhex(hashstring.substring(i + i, i + i + 2));
}

if (unhex(hashstring[5]) >= 1) {
  if (unhex(hashstring[39]) >= 14) {
    monochrome = true;
    features.push("Gen 2: Monochrome")
    featuresReduced.push("Gen 2: Monochrome")
  } else if (unhex(hashstring[39]) >= 12) {
    rainbow = true;
    features.push("Gen 2: Rainbow")
    featuresReduced.push("Gen 2: Rainbow")
  } else {
    features.push("Gen 2: Standard");
    featuresReduced.push("Gen 2: Standard");
  }
} else {
  sprite = true;
  features.push("Gen 2: Spectra");
  featuresReduced.push("Gen 2: Spectra");
  if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 0) {
    features.push("Sprite: Heart");
    featuresReduced.push("Sprite: Heart");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 1) {
    features.push("Sprite: Mushroom");
    featuresReduced.push("Sprite: Mushroom");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 2) {
    features.push("Sprite: Star");
    featuresReduced.push("Sprite: Star");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 3) {
    features.push("Sprite: Hero");
    featuresReduced.push("Sprite: Hero");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 4) {
    features.push("Sprite: Plumber");
    featuresReduced.push("Sprite: Plumber");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 5) {
    features.push("Sprite: Cherry");
    featuresReduced.push("Sprite: Cherry");
  } else if (floor(mapperz(unhex(hashstring[24]), 0, 16, 0, 7)) == 6) {
    features.push("Sprite: Eth");
    featuresReduced.push("Sprite: Eth");
  }
}

if (rainbow && !sprite && !monochrome) {
  if (!log_features) {
    log_features = true;
  }
} else {
  if (unhex(hashstring[45]) >= 12) {
    if (!log_features && !monochrome && !sprite) {
      log_features = true;
      features.push("Color Variant: 3");
      featuresReduced.push("Color Variant: 3");
    }
  } else if (unhex(hashstring[45]) >= 8) {
    if (!log_features && !monochrome && !sprite) {
      log_features = true;
      features.push("Color Variant: 2");
      featuresReduced.push("Color Variant: 2");
    }
  } else if (unhex(hashstring[45]) >= 2) {
    if (!log_features && !monochrome && !sprite) {
      log_features = true;
      features.push("Color Variant: 1");
      featuresReduced.push("Color Variant: 1");
    }
  } else {
    if (!log_features) {
      log_features = true;
      features.push("Color Variant: Ghost");
      featuresReduced.push("Color Variant: Ghost");
    }
  }
}

if (!rainbow && !monochrome && !sprite && (unhex(hashstring[45]) >= 8)) {
  if (unhex(hashstring[7]) > 8) {
    features.push("Color Accent: Light");
    featuresReduced.push("Color Accent: Light");
  } else {
    features.push("Color Accent: Dark");
    featuresReduced.push("Color Accent: Dark");
  }
}

log_features = false
if (unhex(hashstring[30]) == 15) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 10");
  }
} else if (unhex(hashstring[30]) == 14) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 9");
  }
} else if (unhex(hashstring[30]) == 13) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 8");
  }
} else if (unhex(hashstring[30]) == 12) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 7");
  }
} else if (unhex(hashstring[30]) == 11) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 6");
  }
} else if (unhex(hashstring[30]) == 10) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 5");
  }
} else if (unhex(hashstring[30]) == 9) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 4");
  }
} else if (unhex(hashstring[30]) == 8) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 3");
  }
} else if (unhex(hashstring[30]) == 7) {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 2");
  }
} else {
  if (!log_features) {
    log_features = true;
    features.push("Bitmap Style: 1");
  }
}
            }





  return [features, featuresReduced];
}
