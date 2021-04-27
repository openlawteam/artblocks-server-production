exports.features = (projectId, tokenData, tokenId) => {
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (
      ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };
  let features = [];
  let featuresReduced = [];

  //console.log("hashString:"+tokenData);
  console.log(typeof projectId);
  if (projectId === 0) {
    let hashPairs = [];
    let decPairs = [];

    //tokenData = this.props.tokenHashes;
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }

    decPairs = hashPairs.map((x) => {
      return parseInt(x, 16);
    });
    //console.log(hashPairs);
    let steps;
    if (decPairs[28] < 3) {
      features.push("HyperRainbow");
      featuresReduced.push("HyperRainbow");
    } else if (
      Math.floor(decPairs[26].map(0, 255, 12, 20)) === 14 &&
      Math.floor(decPairs[28].map(0, 255, 5, 50)) === 11 &&
      decPairs[22] >= 32 &&
      decPairs[31] >= 35
    ) {
      features.push("Perfect Spectrum");
      featuresReduced.push("Perfect Spectrum");
    }

    if (decPairs[22] < 32 && decPairs[31] < 35) {
      features.push("Pipe");
      featuresReduced.push("Pipe");
      steps = 50;
    } else if (decPairs[31] < 35) {
      features.push("Slinky");
      featuresReduced.push("Slinky");
      steps = 50;
    }
    if (decPairs[22] < 32 && decPairs[31] >= 35) {
      features.push("Fuzzy");
      featuresReduced.push("Fuzzy");
      steps = 1000;
    }
    if (decPairs[23] < 15) {
      if (features.includes("Fuzzy")) {
      } else if (!features.includes("Slinky") && !features.includes("Pipe")) {
        features.push("Bold");
        featuresReduced.push("Bold");
      }
    }
    if (decPairs[24] < 30) {
      if (
        features.includes("Bold") ||
        features.includes("Slinky") ||
        features.includes("Fuzzy") ||
        features.includes("Pipe")
      ) {
      } else {
        features.push("Ribbed (Color: " + decPairs[25] + ")");
        featuresReduced.push("Ribbed");
      }
    }
    if (decPairs[22] >= 32 && decPairs[31] >= 35) {
      steps = 200;
    }
    let startingColor = decPairs[29];
    let endingColor =
      decPairs[28] < 3
        ? (decPairs[29] +
            (Math.floor(decPairs[26].map(0, 255, 12, 20)) * steps) / 0.5) %
          255
        : Math.floor(
            (decPairs[29] +
              (Math.floor(decPairs[26].map(0, 255, 12, 20)) * steps) /
                Math.floor(decPairs[28].map(0, 255, 5, 50))) %
              255
          );
    let difference = function (a, b) {
      return Math.abs(startingColor - endingColor);
    };
    if (difference() < 3 || difference() > 252) {
      if (
        !features.includes("Perfect Spectrum") &&
        !features.includes("Fuzzy")
      ) {
        features.splice(0, 0, "Full Spectrum");
        featuresReduced.splice(0, 0, "Full Spectrum");
      }
    }

    features.push("Starting Color: " + decPairs[29]);
    if (decPairs[28] < 3) {
      features.push(
        "End Color: " +
          ((decPairs[29] +
            (Math.floor(decPairs[26].map(0, 255, 12, 20)) * steps) / 0.5) %
            255)
      );
      features.push("Color Spread: 0.5");
    } else {
      features.push(
        "End Color: " +
          Math.floor(
            (decPairs[29] +
              (Math.floor(decPairs[26].map(0, 255, 12, 20)) * steps) /
                Math.floor(decPairs[28].map(0, 255, 5, 50))) %
              255
          )
      );
      features.push(
        "Color Spread: " + Math.floor(decPairs[28].map(0, 255, 5, 50))
      );
    }

    if (decPairs[30] < 128) {
      features.push("Color Direction: Reverse");
    } else {
      features.push("Color Direction: Forward");
    }
    features.push("Height: " + Math.floor(decPairs[27].map(0, 255, 3, 4)));
    features.push("Segments: " + Math.floor(decPairs[26].map(0, 255, 12, 20)));
    features.push("Steps Between Segments: " + steps);
  } else if (projectId === 2) {
    let pair = tokenData.slice(5, 7);
    let dec = parseInt(pair, 16);

    //console.log(decPairs[6]);
    if (dec > 252) {
      features.push("Complementary Variant");
      featuresReduced.push("Complementary Variant");
    } else if (dec > 239) {
      features.push("Dark Variant");
      featuresReduced.push("Dark Variant");
    } else if (dec > 226) {
      features.push("Light Variant");
      featuresReduced.push("Light Variant");
    } else {
      features.push("Standard Variant");
      featuresReduced.push("Standard Variant");
    }
  } else if (projectId === 3) {
    console.log("in script" + tokenData);

    let seedA = parseInt(tokenData.slice(0, 16), 16);
    console.log("seedA: " + seedA);
    let blotcolorname = [];

    let colfreqs = [
      40,
      80,
      100,
      10,
      3,
      100,
      100,
      80,
      3,
      40,
      10,
      100,
      40,
      10,
      100,
      80,
      3,
      100,
      100,
      10,
      3,
      40,
      100,
      80,
      100,
      10,
      80,
      40,
      100,
      3,
      40,
      3,
      100,
      100,
      80,
      10,
      28,
      3,
      80,
      100,
      100,
      40,
    ];
    let colnames = [
      "White",
      "Silver Gray",
      "Spanish Gray",
      "Gunmetal Gray",
      "Stone Gray",
      "Marengo Gray",
      "Argentinian Blue",
      "Savoy Blue",
      "Egyptian Blue",
      "Bleu de France",
      "Delft Blue",
      "Moroccan Blue",
      "Avocado Green",
      "Forest Green",
      "Mantis Green",
      "Shamrock Green",
      "Tea Green",
      "Emerald Green",
      "Cardinal Red",
      "Carmine Red",
      "Crimson Red",
      "Salmon Red",
      "Lust Red",
      "Spanish Red",
      "Tyrian Purple",
      "Royal Purple",
      "Orchid Purple",
      "Mardis Gras Purple",
      "Palatinate Purple",
      "Thistle Purple",
      "Cream Yellow",
      "Xanthic Yellow",
      "Canary Yellow",
      "Golden Yellow",
      "Hunyadi Yellow",
      "Process Yellow",
      "Beaver Brown",
      "Beige Brown",
      "Chestnut Brown",
      "Chocolate Brown",
      "Dark Brown",
      "Khaki Brown",
    ];

    let numblobs = 1;
    let randnum = Math.floor(rnd().map(0, 1, 0, 1000)); //int(map(rnd(), 0, 1, 0, 1000));
    console.log("randnum" + randnum);
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
      features.push("Color: " + blotcolorname[i]);
      featuresReduced.push(blotcolorname[i]);
    }

    function getFillColor() {
      let whichArray = [];
      let which = Math.floor(rnd().map(0, 1, 0, colnames.length)); //int(map(rnd(), 0, 1, 0, colnames.length));
      //whichArray.push(which);
      let threshold = rnd().map(0, 1, 0, 100); //map(rnd(), 0, 1, 0, 100);

      while (threshold > colfreqs[which]) {
        which = Math.floor(rnd().map(0, 1, 0, colnames.length)); //int(map(rnd(), 0, 1, 0, colnames.length));
        whichArray.push(which);
      }
      blotcolorname.push(colnames[which]);
      console.log("WhichArray: " + whichArray);
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

      return ((seedA < 0 ? ~seedA + 1 : seedA) % 1000) / 1000;
    }
  } else if (projectId === 4) {
    let hashPairs = [];
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }
    let rvs = hashPairs.map((x) => {
      return parseInt(x, 16) % 20;
    });

    let palette_choices = [
      "Moonrise",
      "Budapest",
      "Rushmore",
      "Invaders",
      "Jade Theory",
      "Frost",
      "Purple Rain",
      "Kingdom",
    ];

    let rv0 = rvs[0];

    let rv2 = rvs[2];
    let rv3 = rvs[3];
    let rv4 = rvs[4];
    let rv5 = rvs[5];
    let rv6 = rvs[6];

    let cp_r = rnd_outcome(
      rv0,
      [19, 18, 17, 16, 14, 12, 8],
      [7, 6, 5, 4, 3, 2, 1],
      0
    );
    var pie_count = rnd_outcome(
      rv2,
      [19, 18, 17, 16, 14, 12],
      [4, 5, 6, 8, 14, 12],
      10
    );
    var stk_color = rnd_outcome(rv3, [10], ["Silver"], "Midnight");
    var pie_number = rnd_outcome(rv4, [10], [2], 1);
    var palette = palette_choices[cp_r];

    if (rv5 === 19) {
      if (rv6 === 19) {
        stk_color = "Lime";
        palette = "Cyber";
      }
    }
    if (rv5 === 18) {
      if (rv6 === 18) {
        stk_color = "Silver";
        palette = "Cloud Nine";
      }
    }

    features = [
      "Palette: " + palette,
      "Count: " + String(pie_count - 1),
      "Slices: " + (pie_number === 2 ? "Multi" : "Single"),
      "Stroke: " + stk_color,
    ];

    featuresReduced = [
      "Palette: " + palette,
      "Count: " + String(pie_count - 1),
    ];

    function rnd_outcome(input, values, outcome, fallback) {
      var zip = (a, b) => a.map((x, i) => [x, b[i]]);
      for (let [a, b] of zip(values, outcome))
        if (input >= a) {
          return b;
        }
      return fallback;
    }
  } else if (projectId === 8) {
    let mass_lower = 600.0;
    let mass_upper = 1200.0;
    let aper_lower = 100.0;
    let aper_upper = 400.0;
    let forc_lower = 550.0;
    let forc_upper = 2250.0;
    let turb_lower = 0.001;
    let turb_upper = 1.0;
    let chao_lower = 0.001;
    let chao_upper = 0.002;
    let deta_lower = 4.0;
    let deta_upper = 10.0;
    let final_sat = 0.0;
    let gradlev = 0;

    let data = [];

    function evaluate(n, metadata) {
      let meta = {
        description: "",
        prob: 0,
      };

      let points = {
        form: 0,
        rare: 0,
      };

      if (n === 1.0) {
        meta.desciption = "absolute";
        points.rare = 2;
        points.form = 7;
        meta.prob = 0.001;
      } else if (n === 0.0) {
        meta.desciption = "void";
        points.rare = 2;
        points.form = 7;
        meta.prob = 0.001;
      } else if (n <= 0.01) {
        meta.desciption = "minimal";
        points.rare = 1;
        points.form = 5;
        meta.prob = 0.01;
      } else if (n > 0.01 && n < 0.1) {
        meta.desciption = "marginal";
        points.form = 3;
        meta.prob = 0.09;
      } else if (n > 0.1 && n < 0.25) {
        meta.desciption = "low";
        points.form = 1;
        meta.prob = 0.15;
      } else if (n > 0.99) {
        meta.desciption = "extreme";
        points.rare = 1;
        points.form = 5;
        meta.prob = 0.01;
      } else if (n < 0.99 && n > 0.9) {
        meta.desciption = "super";
        points.form = 3;
        meta.prob = 0.09;
      } else if (n < 0.9 && n > 0.75) {
        meta.desciption = "high";
        points.form = 1;
        meta.prob = 0.15;
      } else {
        meta.desciption = "average";
        meta.prob = 0.5;
      }

      return metadata ? meta : points;
    }

    function generate_artblocks_metadata(formdata) {
      let meta_mass = evaluate(formdata.mass, true);
      let meta_force = evaluate(formdata.force, true);
      let meta_symmetry = evaluate(formdata.symmetry, true);
      let meta_turbulence = evaluate(formdata.turbulence, true);
      let meta_chaos = evaluate(formdata.chaos, true);

      let prob =
        meta_mass.prob *
        meta_force.prob *
        meta_symmetry.prob *
        meta_turbulence.prob *
        meta_chaos.prob;

      let massstr =
        "Mass: " +
        (formdata.mass * 100).toFixed(1) +
        "% (" +
        meta_mass.desciption.toUpperCase() +
        ")";
      let forcestr =
        "Force: " +
        (formdata.force * 100).toFixed(1) +
        "% (" +
        meta_force.desciption.toUpperCase() +
        ")";
      let symstr =
        "Symmetry: " +
        (formdata.symmetry * 100).toFixed(1) +
        "% (" +
        meta_symmetry.desciption.toUpperCase() +
        ")";
      let turbstr =
        "Turbulence: " +
        (formdata.turbulence * 100).toFixed(1) +
        "% (" +
        meta_turbulence.desciption.toUpperCase() +
        ")";
      let chaosstr =
        "Chaos: " +
        (formdata.chaos * 100).toFixed(1) +
        "% (" +
        meta_chaos.desciption.toUpperCase() +
        ")";
      let prostr = "Chance: 1 in " + Math.trunc(1.0 / prob);
      let satstr = "Saturation: " + (final_sat * 100).toFixed(1) + "%";
      let gradstr = "Colour Set: " + gradlev;

      return [
        massstr,
        forcestr,
        symstr,
        turbstr,
        chaosstr,
        satstr,
        gradstr,
        prostr,
      ];
    }

    function generate_artblocks_metadata2(formdata) {
      let meta_mass = evaluate(formdata.mass, true);
      let meta_force = evaluate(formdata.force, true);
      let meta_symmetry = evaluate(formdata.symmetry, true);
      let meta_turbulence = evaluate(formdata.turbulence, true);
      let meta_chaos = evaluate(formdata.chaos, true);

      let prob =
        meta_mass.prob *
        meta_force.prob *
        meta_symmetry.prob *
        meta_turbulence.prob *
        meta_chaos.prob;

      let massstr =
        "Mass: " +
        (formdata.mass * 100).toFixed(1) +
        "% (" +
        meta_mass.desciption.toUpperCase() +
        ")";
      let forcestr =
        "Force: " +
        (formdata.force * 100).toFixed(1) +
        "% (" +
        meta_force.desciption.toUpperCase() +
        ")";
      let symstr =
        "Symmetry: " +
        (formdata.symmetry * 100).toFixed(1) +
        "% (" +
        meta_symmetry.desciption.toUpperCase() +
        ")";
      let turbstr =
        "Turbulence: " +
        (formdata.turbulence * 100).toFixed(1) +
        "% (" +
        meta_turbulence.desciption.toUpperCase() +
        ")";
      let chaosstr =
        "Chaos: " +
        (formdata.chaos * 100).toFixed(1) +
        "% (" +
        meta_chaos.desciption.toUpperCase() +
        ")";
      let prostr = "Chance: 1 in " + Math.trunc(1.0 / prob);
      let satstr = "Saturation: " + (final_sat * 100).toFixed(1) + "%";
      let gradstr = "Colour Set: " + gradlev;

      return [gradstr];
    }

    function lerp(start, end, amt) {
      return (1 - amt) * start + amt * end;
    }

    function process_formdata(hashdata) {
      let idx_mass = 1;
      let idx_aperture = 2;
      let idx_force = 3;
      let idx_symmetry = 4;
      let idx_turbulence = 5;
      let idx_chaos = 6;
      let idx_saturation = 7;
      let idx_detail = 8;

      let formdata = {
        mass: hashdata[idx_mass],
        aperture: hashdata[idx_aperture],
        force: hashdata[idx_force],
        symmetry: hashdata[idx_symmetry],
        turbulence: hashdata[idx_turbulence],
        chaos: hashdata[idx_chaos],
        saturation: hashdata[idx_saturation],
        detail: hashdata[idx_detail],
      };

      return formdata;
    }

    function evaluate_points(fd) {
      let points_mass = evaluate(fd.mass, false);
      let points_force = evaluate(fd.force, false);
      let points_symmetry = evaluate(fd.symmetry, false);
      let points_turbulence = evaluate(fd.turbulence, false);
      let points_chaos = evaluate(fd.chaos, false);

      let points = {
        form:
          points_mass.form +
          points_force.form +
          points_symmetry.form +
          points_turbulence.form +
          points_chaos.form,

        rare:
          points_mass.rare +
          points_force.rare +
          points_symmetry.rare +
          points_turbulence.rare +
          points_chaos.rare,
      };

      return points;
    }

    function generate_renderdata(fd) {
      let points = evaluate_points(fd);

      let renderdata = {
        mass: lerp(mass_lower, mass_upper, fd.mass),
        aperture: lerp(aper_lower, aper_upper, fd.aperture),
        force: lerp(forc_lower, forc_upper, fd.force),
        symmetry: 1.0 - fd.symmetry,
        turbulence: lerp(turb_lower, turb_upper, fd.turbulence),
        chaos: lerp(chao_lower, chao_upper, fd.chaos),
        saturation: fd.saturation,
        form_points: points.form,
        rare_points: points.rare,
        detail: lerp(deta_lower, deta_upper, fd.detail),
      };

      return renderdata;
    }

    function process_hash(txn) {
      let hash_index = 0;

      for (let i = 2; i < 65; i += 2) {
        let from = i;
        let to = i + 2;
        let s = txn.substring(from, to);

        data[hash_index] = parseInt(s, 16) / 255.0;

        hash_index++;
      }

      return data;
    }

    function init(txn) {
      let hashdata = process_hash(txn);
      let formdata = process_formdata(hashdata);
      let renderdata = generate_renderdata(formdata);

      render(renderdata);

      let ab_metadata = generate_artblocks_metadata(formdata);

      return ab_metadata;
    }

    function init2(txn) {
      let hashdata = process_hash(txn);
      let formdata = process_formdata(hashdata);
      let renderdata = generate_renderdata(formdata);

      render(renderdata);

      let ab_metadata = generate_artblocks_metadata2(formdata);

      return ab_metadata;
    }
    let sat;

    function render(rd) {
      gradlev = rd.rare_points + 1;

      if (rd.form_points === 0) {
        sat = 0.0;
      } else if (rd.form_points > 0 && rd.form_points < 7) {
        sat = lerp(0.0, 0.25, rd.saturation);
      } else if (rd.form_points >= 7 && rd.form_points < 9) {
        sat = lerp(0.2, 0.75, rd.saturation);
      } else if (rd.form_points >= 9 && rd.form_points < 10) {
        sat = lerp(0.75, 0.9, rd.saturation);
      } else if (rd.form_points >= 10 && rd.form_points < 11) {
        sat = lerp(0.9, 1.0, rd.saturation);
      } else {
        sat = 1.0;
      }

      final_sat = sat;
    }

    features = init(tokenData);
    featuresReduced = init2(tokenData);
  } else if (projectId === 9) {
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
        },
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
          s[0],
          s[1],
          s[2],
          s[3],
          s[4],
          s[5],
          s[6],
          s[7],
          s[8],
          s[9],
          s[10],
          s[11],
          s[12],
          s[13],
          s[14],
          s[15],
          s[16],
          s[17],
          s[18],
          s[19],
          s[20],
          s[21],
          s[22],
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
            [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
            ],
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
            rule[namerule] = randomrule(
              totalWeight,
              weight,
              index,
              index.length
            );
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
      } else if (R === 1.52) {
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
            ry: randint(360),
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
          (s) => {},
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
        },
      };
      structure(setup, rules);
      return features;
    };

    features = ignitionFeatures(tokenData);
  } else if (projectId === 10) {
    function to1(n) {
      return n / 255;
    }
    function to1N(n) {
      return n / 128 - 1;
    }
    function toNDecs(n, m) {
      n = Math.round(n * (m * 10)) / (m * 10);
      var a = n.toString().split(".");
      if (a.length === 2) {
        return Number(a[0] + "." + a[1].substring(0, 3));
      } else {
        return Number(n);
      }
    }
    function printf(s, a) {
      var newS = s,
        i;
      for (i = 0; i < a.length; i++) {
        newS = newS.replace("%s", a[i]);
      }
      return newS;
    }
    function getNums() {
      var hashPairs = [],
        rvs,
        j = 0;
      //let seed = parseInt(tokenData.hash.slice(0,16), 16);
      for (j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
      }
      rvs = hashPairs.map((n) => parseInt(n, 16));
      return rvs;
    }
    function getWireData() {
      var c,
        i,
        /*d,*/ y,
        data = {
          red: 0,
          green: 0,
          blue: 0,
          yellow: 0,
          total: 0,
          dangle: 0,
          hidden: 0,
        };
      for (i = 0; i < cwires; i++) {
        c = colors[nums[i] % colors.length];
        data[c]++;
        if (nums[i] < 85) {
          y = to1N(nums[(i + 2) % 32]);
          if (y < 0) data.hidden++;
          data.dangle++;
        }
        data.total++;
      }
      return data;
    }
    var colors = ["red", "blue", "green", "yellow"];
    var nums = getNums(),
      cblobs,
      brow /*,myp*/,
      mw,
      smile,
      fcolor;
    var /*ed,*/ browAng /*,pupOffs*/, stache, blush, blinkRate;
    var SZ = Math.min(2400, 2400);

    cblobs = (nums[0] % 7) + 6;
    let cwires = (nums[0] % 28) + 4;
    let wiredata = getWireData();
    brow = nums[2] <= 128;
    //myp = toNDecs( to1(nums[3]), 3 );
    mw = toNDecs(to1(nums[4]) * (SZ / 6.7), 3);
    smile = toNDecs(to1N(nums[5]) * (SZ / 20) * -1, 3);
    fcolor = colors[nums[6] % colors.length];
    //ed = toNDecs( to1(nums[7])*(SZ/13.33), 3 );
    browAng = toNDecs(to1N(nums[8]) * 45, 3);
    /*pupOffs = [
  toNDecs( to1N(nums[9]), 3 ),
  toNDecs( to1N(nums[10]), 3 )
];*/
    stache = nums[12] < 39;
    blush = nums[15] < 39;
    blinkRate = toNDecs((to1(nums[18]) * 10000 + 5000) / 1000, 3);

    features.push("Cloud Blobs: " + cblobs);
    features.push(
      printf("%s Wires / %s Dangling / %s Hidden", [
        cwires,
        wiredata.dangle,
        wiredata.hidden,
      ])
    );
    //features.push( printf("%s Wires / %s Dangling", [cwires,wiredata.dangle] ));
    //features.push( printf( "%s Wires",[cwires]));
    //features.push( "Mouth Y Position: " + myp);
    features.push("Mouth Width: " + Math.round(mw));
    features.push("Face Color: " + fcolor);
    features.push("Smile Amount: " + Math.round(smile));
    features.push("Blink Rate: " + Math.round(blinkRate) + " seconds");
    if (blush) {
      features.push("Blush Variant");
      featuresReduced.push("Blush Variant");
    }

    //features.push( "Eye Distance: " + ed );
    //features.push( "Eye Direction: " + pupOffs );
    if (brow) {
      features.push("Eyebrow Angle: " + Math.round(browAng));
    } else {
      features.push("No Eyebrows Variant");
      featuresReduced.push("No Eyebrows Variant");
    }
    if (stache) {
      features.push("Mustache Variant");
      featuresReduced.push("Mustache Variant");
    }

    console.log(features.join("\n"));
  } else if (projectId === 11) {
    let hashPairs = [];

    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }

    let decPairs = hashPairs.map((x) => {
      return parseInt(x, 16);
    });

    let colorTypes = ["Gradient", "Rainbow", "None"];

    let flipModes = ["None", "XFlip", "YFlip", "XYFlip", "Kaleido"];

    let layers = Math.round(decPairs[0].map(0, 255, 1, 3));

    let cT = 0;
    if (decPairs[1 + layers + 2] % 50 === 1) {
      cT = 1;
    }
    if (decPairs[1 + layers + 8] % 25 === 3) {
      cT = 2;
    }

    let fM = 0;
    let mirror = Math.round(decPairs[1 + layers + 7].map(0, 255, 0.0, 5.0));
    if (mirror === 0) {
      fM = 1;
    }
    if (mirror === 1) {
      fM = 2;
    }

    if (mirror === 2) {
      fM = 3;
    }
    if (mirror === 3) {
      fM = 4;
    }

    var colorMode = colorTypes[cT];
    var flipMode = flipModes[fM];

    let colorBase = decPairs[1 + layers + 1];
    let speed = 0;
    let dimensions = 0;
    for (let i = 0; i < layers; i++) {
      dimensions += Math.round(decPairs[1 + i].map(0, 255, 1, 6));
      speed += decPairs[1 + i].map(0, 255, 0.05, 0.5);
    }

    features = [
      "ColorMode: " + colorMode,
      "FlipMode: " + flipMode,
      "Layers: " + String(layers),
      "ColorBase(0-255): " + String(colorBase),
      "Speed: " + String(speed.toFixed(2)),
      "Dimension: " + String(dimensions),
    ];
    featuresReduced = ["ColorMode: " + colorMode, "FlipMode: " + flipMode];
  } else if (projectId === 12) {
    let seed = parseInt(tokenData.slice(0, 16));
    let chance = 0;

    function rnd() {
      seed ^= seed << 13;

      seed ^= seed >> 17;

      seed ^= seed << 5;

      return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
    }

    let colors = [
      ["#0c0f0a", "#ff206e", "#fbff12", "#41ead4", "#ffffff"], // Cmyk
      ["#000000", "#111111", "#232323", "#575757", "#7a7a7a"], // Obsidian
      ["#ffffff", "#e3e3e3", "#aaaaaa", "#dbdbdb", "#e5e5e5"], // Diamond
      ["#114b5f", "#1a936f", "#88d498", "#c6dabf", "#f3e9d2"], // Emerald
      ["#2b2d42", "#8d99ae", "#edf2f4", "#ef233c", "#d90429"], // Ruby
      ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"], // Blue Amber
      ["#f72585", "#7209b7", "#3a0ca3", "#4361ee", "#4cc9f0"], // Amethyst (Fluorite)
      ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"], // Ocean Jasper
      ["#0b132b", "#1c2541", "#3a506b", "#5bc0be", "#6fffe9"], // Turquoise
      ["#00296b", "#003f88", "#00509d", "#fdc500", "#ffd500"], // Labradorite
      ["#000000", "#14213d", "#fca311", "#e5e5e5", "#ffffff"], // Sunset sodalite
      ["#8dd635", "#8cff00", "#052233", "#093954", "#054f77"], // Amazonite
      ["#562c2c", "#f2542d", "#f5dfbb", "#0e9594", "#127475"], // Ammolite
      ["#011627", "#fdfffc", "#2ec4b6", "#e71d36", "#ff9f1c"], // CMKY Night
    ];

    function shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

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
    });

    const rCol = rnd();
    var palletteName;
    let colorPointer;
    if (rCol < 0.03) {
      // 3 % chance Cmyk
      colorPointer = 0;
      palletteName = "CMYK";
      chance = 0.03;
    } else if (rCol >= 0.03 && rCol < 0.08) {
      // 5 % chance Obsidian
      colorPointer = 1;
      palletteName = "Obsidian";
      chance = 0.05;
    } else if (rCol >= 0.08 && rCol < 0.13) {
      // 5 % chance Diamond
      colorPointer = 2;
      palletteName = "Diamond";
      chance = 0.05;
    } else if (rCol >= 0.13 && rCol < 0.19875) {
      // 6.875 % chance Emerald
      colorPointer = 3;
      palletteName = "Emerald";
      chance = 0.06875;
    } else if (rCol >= 0.19875 && rCol < 0.2675) {
      // 6.875 % chance Ruby
      colorPointer = 4;
      palletteName = "Ruby";
      chance = 0.06875;
    } else if (rCol >= 0.2675 && rCol < 0.33625) {
      // 6.875 % chance Blue Amber
      colorPointer = 5;
      palletteName = "Blue Amber";
      chance = 0.06875;
    } else if (rCol >= 0.33625 && rCol < 0.405) {
      // 6.875 % chance Fluorite
      colorPointer = 6;
      palletteName = "Fluorite";
      chance = 0.06875;
    } else if (rCol >= 0.405 && rCol < 0.49) {
      // 8.5 % chance Ocean Jasper
      colorPointer = 7;
      palletteName = "Ocean Jasper";
      chance = 0.085;
    } else if (rCol >= 0.49 && rCol < 0.575) {
      // 8.5 % chance Turquoise
      colorPointer = 8;
      palletteName = "Turquoise";
      chance = 0.085;
    } else if (rCol >= 0.575 && rCol < 0.66) {
      // 8.5 % chance Labradorite
      colorPointer = 9;
      palletteName = "Labradorite";
      chance = 0.085;
    } else if (rCol >= 0.66 && rCol < 0.745) {
      // 8.5 % chance Sunset sodalite
      colorPointer = 10;
      palletteName = "Sunset sodalite";
      chance = 0.085;
    } else if (rCol >= 0.745 && rCol < 0.83) {
      // 8.5 % chance Amazonite
      colorPointer = 11;
      palletteName = "Amazonite";
      chance = 0.085;
    } else if (rCol >= 0.83 && rCol < 0.915) {
      // 8.5 % chance Ammolite
      colorPointer = 12;
      palletteName = "Ammolite";
      chance = 0.085;
    } else {
      // 8.5 % chance Cmyk night
      colorPointer = 13;
      palletteName = "CMYK night";
      chance = 0.085;
    }

    const numColRnd = rnd();
    let numColors;
    if (numColRnd < 0.1) {
      // 10 % chance 2 colors
      numColors = 2;
      chance *= 0.1;
    } else if (numColRnd >= 0.1 && numColRnd < 0.3) {
      // 20 % chance 3 colors
      numColors = 3;
      chance *= 0.2;
    } else if (numColRnd >= 0.3 && numColRnd < 0.5) {
      // 20 % chance 4 colors
      numColors = 4;
      chance *= 0.2;
    } else {
      // 50 % chance 5 colors
      numColors = 5;
      chance *= 0.5;
    }

    function genColor() {
      let col = "";
      col =
        colors[colorPointer][parseInt((rnd() * (numColors - 1)).toFixed(0))];
      return col;
    }

    function genArc() {
      const col1 = genColor();

      const rotArc = genArc ? rnd() : 0;
    }

    function genTri() {
      const col1 = genColor();

      const rot = rnd();
    }

    var letcolor = null;
    let letters = "";

    function genLetter(row, col, colbg) {
      letcolor = letcolor ? letcolor : genColor();

      while (colbg === letcolor) {
        letcolor = genColor();
      }

      letters += String.fromCharCode(rnd() * 25 + 65);
    }

    var numColsAndRows;
    var rs = rnd();
    if (rs >= 0 && rs < 0.3) {
      // 30 % chance 5x5
      numColsAndRows = 5;
      chance *= 0.3;
    } else if (rs >= 0.3 && rs < 0.55) {
      // 25 % chance 10x10
      numColsAndRows = 10;
      chance *= 0.25;
    } else if (rs >= 0.55 && rs < 0.8) {
      // 25 % chance 15x15
      numColsAndRows = 15;
      chance *= 0.25;
    } else {
      // 20 % chance 20x20
      numColsAndRows = 20;
      chance *= 0.2;
    }

    const letbg = genColor();

    const shape = rnd();

    if (shape < 0.075) {
      // 7.5 % chance Wave
      chance *= 0.075;
    } else if (shape >= 0.075 && shape < 0.15) {
      // 7.5 % chance Angled
      chance *= 0.075;
    } else if (shape >= 0.15 && shape < 0.65) {
      // 50 % chance Fifty-Fifty
      chance *= 0.5;
    } else if (shape >= 0.65 && shape < 0.825) {
      // 17.5 % chance Wavy-up
      chance *= 0.175;
    } else {
      // 17.5 % chance Angled-up
      chance *= 0.175;
    }

    var shapeName;

    for (let i = 1; i <= Math.pow(numColsAndRows, 2); i++) {
      var row = Math.ceil(i / numColsAndRows);

      var col = i - (row - 1) * numColsAndRows;
      let bgcol = genColor();

      if (i > Math.pow(numColsAndRows, 2) - 3) {
        genLetter(row, col, letbg);
      }

      var r = rnd();
      if (shape < 0.075) {
        // 7.5 % chance Wave
        shapeName = "Wave";
        genArc();
      } else if (shape >= 0.075 && shape < 0.15) {
        // 7.5 % chance Angled
        shapeName = "Angled";
        genTri();
      } else if (shape >= 0.15 && shape < 0.65) {
        // 50 % chance Fifty-Fifty
        shapeName = "Fifty-Fifty";
        if (r >= 0.5) {
          genArc();
        } else {
          genTri();
        }
      } else if (shape >= 0.65 && shape < 0.825) {
        // 17.5 % chance Wavy-up
        shapeName = "Wavy-up";
        if (r >= 0.25) {
          genArc();
        } else {
          genTri();
        }
      } else {
        // 17.5 % chance Angled-up
        shapeName = "Angled-up";
        if (r >= 0.25) {
          genTri();
        } else {
          genArc();
        }
      }
    }

    const rhmusic = rnd();

    const rmusic = rnd();
    let beatName;
    if (rmusic >= 0 && rmusic < 0.125) {
      beatName = "Beat1";
    } else if (rmusic >= 0.125 && rmusic < 0.25) {
      beatName = "Beat2";
    } else if (rmusic >= 0.25 && rmusic < 0.375) {
      beatName = "Beat3";
    } else if (rmusic >= 0.375 && rmusic < 0.5) {
      beatName = "Beat4";
    } else if (rmusic >= 0.5 && rmusic < 0.625) {
      beatName = "Beat5";
    } else if (rmusic >= 0.625 && rmusic < 0.75) {
      beatName = "Beat6";
    } else if (rmusic >= 0.75 && rmusic < 0.875) {
      beatName = "Beat7";
    } else {
      beatName = "Beat8";
    }
    chance *= 0.125;

    var frq = rnd() * 1.25;

    while (frq < 0.75) {
      // means between 0.75 and 1.25
      frq = rnd() * 1.25;
    }

    features = [
      "Palette: " + palletteName,
      "# of colors: " + String(numColors),
      "Grid size: " + String(numColsAndRows + "x" + numColsAndRows),
      "Shape: " + shapeName,
      "Beat: " + beatName,
    ];

    featuresReduced = [
      "Palette: " + palletteName,
      "# of colors: " + String(numColors),
      "Grid size: " + String(numColsAndRows + "x" + numColsAndRows),
      "Shape: " + shapeName,
      "Beat: " + beatName,
    ];
  } else if (projectId === 13) {
    // class needed for ringer
    class DeadRinger {
      constructor(points) {
        this.points = points;
      }

      generate(wrap, forceCentroid, shouldSort) {
        let centroid;

        if (forceCentroid) {
          centroid = [forceCentroid[0], forceCentroid[1]];
        } else {
          centroid = [0, 0];
          this.points.forEach((i) => {
            centroid[0] += i.cx;
            centroid[1] += i.cy;
          });
          centroid = [
            centroid[0] / this.points.length,
            centroid[1] / this.points.length,
          ];
        }

        if (shouldSort) {
          this.points.sort((a, b) => {
            let aAng = Math.atan2(a.cy - centroid[1], a.cx - centroid[0]);
            let bAng = Math.atan2(b.cy - centroid[1], b.cx - centroid[0]);

            let angleDifference = (aAng - bAng) % (Math.PI * 2);
            let spaceDifference = -(
              distance(a.cx, a.cy, centroid[0], centroid[1]) -
              distance(b.cx, b.cy, centroid[0], centroid[1])
            );

            let zeroAngleDifference = Math.abs(angleDifference) < 0.0001;
            let zeroSpaceDifference = Math.abs(spaceDifference) < 0.0001;

            let qualifier = zeroAngleDifference
              ? spaceDifference
              : angleDifference;
            let result =
              zeroAngleDifference && zeroSpaceDifference
                ? a.id - b.id
                : qualifier;
            return result;
          });
        }

        for (
          let i = 0;
          i < this.points.length && this.points.length > 1;
          i += 1
        ) {
          let prev = this.points[i - 1 < 0 ? this.points.length - 1 : i - 1];

          let current = this.points[i];
          current.sortedOrder = i;

          let next = this.points[(i + 1) % this.points.length];

          let dAx = prev.cx - current.cx;
          let dAy = prev.cy - current.cy;
          let dBx = next.cx - current.cx;
          let dBy = next.cy - current.cy;

          var ang = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
          current.isConcave =
            (ang < 0 && Math.abs(ang) <= Math.PI) ||
            Math.abs(Math.abs(ang) - Math.PI) < 0.0001;
        }
      }
    }

    let rawParams = setupParametersFromTokenData(tokenData);
    // we may need to rename?
    let seed = generateSeedFromTokenData(tokenData);

    let GRID_ALGORITHM = 0;
    let RECURSIVE_GRID_ALGORITHM = 1;
    let CONSTANT_RADIUS = 0;
    let BIGGER_NEAR_CENTER_RADIUS = 1;
    let BIGGER_FAR_CENTER_RADIUS = 2;

    //let tokenId = parseInt(tokenData.tokenId.substring(2))

    let params = {
      gridDimension: parseInt(mapParam(rawParams[0], 3, 6)),
      radius: mapParam(rawParams[1], 0.5, 0.8),
      sampleRate: mapParam(rawParams[2], 0.5, 0.8),
      wrapped: rawParams[3] < 127,
      drawAllPoints: rawParams[4] < 127,
      forceCentroid: rawParams[5] > 200,
      fill: rawParams[6] < 127,
      pointsAlgorithm:
        rawParams[7] < 220 ? GRID_ALGORITHM : RECURSIVE_GRID_ALGORITHM,
      variableRadius:
        rawParams[8] > 200
          ? rawParams[8] > 227
            ? BIGGER_NEAR_CENTER_RADIUS
            : BIGGER_FAR_CENTER_RADIUS
          : CONSTANT_RADIUS,
      backgroundHighlight: rawParams[9] > 220,
      fillHighlight: rawParams[10] > 220,
      useSecondaryColor: rawParams[11] < 75,
      useSecondaryColorForBackground: rawParams[12] > 170,
      concentric:
        rawParams[13] <= 13 ||
        (rawParams[13] > 108 && rawParams[13] <= 110) ||
        rawParams[13] === 69 ||
        rawParams[13] === 33 ||
        rawParams[13] === 43,
      flipConcaveColor:
        rawParams[14] > 200 && (rawParams[6] >= 127 || rawParams[10] > 220),
      backgroundColor: rawParams[22] < 250 ? "#f5f5f5" : "#2b2b2b",
      subtleBackgroundColor: "#f7f7e6",
      strokeColor: rawParams[22] < 250 ? "#2b2b2b" : "#f5f5f5",
      highlightColor: rawParams[22] < 250 ? "#f2c945" : "#2b2b2b",
      secondaryColor:
        rawParams[15] >= 19 && rawParams[15] <= 230
          ? "#c3423f"
          : rawParams[15] > 230 && rawParams[15] <= 234
          ? "#3b9764"
          : "#4381c1",
      useSecondaryColorForFill: rawParams[16] <= 85,
      strokeWeight: 8,
      padding: rawParams[17] > 14 ? 1 : 2.66,
      shrinkConcavePegs: rawParams[18] >= 245,
      useSubtleBackground: rawParams[19] >= 245,
      offsetGrid: rawParams[7] < 220 && rawParams[20] > 205,
      offsetGridStarting: rawParams[21] > 127,
    };

    // where the magic happens, this is very sensitive so be careful
    calculateFeatures();

    // The features array now is filled
    console.log(features);

    // Function to calculate features

    function calculateFeatures() {
      let dimWidth = 1200;
      let dimHeight = dimWidth;

      //let strokeWidth = params.strokeWeight * dimWidth/800
      let highlightBackgroundPick = params.useSecondaryColorForBackground
        ? params.secondaryColor
        : params.highlightColor;
      let actualBackgroundColor = params.backgroundHighlight
        ? highlightBackgroundPick
        : params.useSubtleBackground
        ? params.subtleBackgroundColor
        : params.backgroundColor;
      features.push("Background: " + hexToName(actualBackgroundColor));
      featuresReduced.push("Background: " + hexToName(actualBackgroundColor));

      let padding = dimWidth * params.padding * 0.08;
      features.push("Size: " + (params.padding === 1 ? "Normal" : "smol boi"));
      featuresReduced.push(
        "Size: " + (params.padding === 1 ? "Normal" : "smol boi")
      );
      let innerWidth = dimWidth - 2 * padding;
      let innerHeight = dimHeight - 2 * padding;

      let cellDimension = innerWidth / params.gridDimension;

      let points = [];

      let sampleRate = params.sampleRate;

      let centroid = params.forceCentroid
        ? [range(0, cellDimension * 2), range(dimHeight / 2, dimHeight)]
        : false;
      let wrapped = params.wrapped;

      features.push(
        "Wrap orientation: " + (centroid ? "Off-center" : "Balanced")
      );
      featuresReduced.push(
        "Wrap orientation: " + (centroid ? "Off-center" : "Balanced")
      );

      features.push("Wrap style: " + (wrapped ? "Weave" : "Loop"));
      featuresReduced.push("Wrap style: " + (wrapped ? "Weave" : "Loop"));

      if (params.pointsAlgorithm === GRID_ALGORITHM) {
        points = pointsOnGrid(points, padding, cellDimension);
        if (!params.offsetGrid) {
          features.push(
            "Peg layout: " +
              params.gridDimension +
              "x" +
              params.gridDimension +
              " grid"
          );
          featuresReduced.push(
            "Peg layout: " +
              params.gridDimension +
              "x" +
              params.gridDimension +
              " grid"
          );
        } else {
          features.push(
            "Peg layout: Tiled " +
              (params.gridDimension - (params.offsetGridStarting ? 0 : 1)) +
              "," +
              (params.gridDimension - (params.offsetGridStarting ? 1 : 0))
          );
          featuresReduced.push(
            "Peg layout: Tiled " +
              (params.gridDimension - (params.offsetGridStarting ? 0 : 1)) +
              "," +
              (params.gridDimension - (params.offsetGridStarting ? 1 : 0))
          );
        }
      } else if (params.pointsAlgorithm === RECURSIVE_GRID_ALGORITHM) {
        pointsOnRecursiveGrid(
          points,
          padding,
          padding,
          innerWidth,
          innerHeight
        );
        features.push("Peg layout: Recursive grid");
        featuresReduced.push("Peg layout: Recursive grid");
      }

      if (params.variableRadius !== CONSTANT_RADIUS) {
        let biggerCenter = params.variableRadius === BIGGER_NEAR_CENTER_RADIUS;
        if (biggerCenter) {
          features.push("Peg scaling: Bigger near center");
        } else {
          features.push("Peg scaling: Smaller near center");
        }

        points.forEach((p, i) => {
          let distanceToCenter = distance(
            dimWidth / 2,
            dimHeight / 2,
            p.cx,
            p.cy
          );
          let biggerCenterCoefficient =
            1 / (1 + distanceToCenter / (dimWidth / 5));
          let smallerCenterCoefficient =
            (1 + distanceToCenter + cellDimension) /
            distance(dimWidth / 2, dimHeight / 2, 0, 0);
          let coefficient =
            range(0.8, 1) *
            (biggerCenter ? biggerCenterCoefficient : smallerCenterCoefficient);
          p.r *= coefficient;
        });
      } else {
        features.push("Peg scaling: Uniform");
      }

      let { samples, leftOver } = sampleSize(
        points,
        parseInt(sampleRate * points.length)
      );

      let ringer = new DeadRinger(samples);

      ringer.generate(wrapped, centroid, true);

      let bodyFillColor;

      if (params.fill) {
        let fillHighlightColor = params.useSecondaryColorForFill
          ? params.secondaryColor
          : params.highlightColor;
        bodyFillColor = params.fillHighlight
          ? fillHighlightColor
          : params.strokeColor;
      } else {
        bodyFillColor = params.backgroundColor;
      }

      features.push("Body: " + hexToName(bodyFillColor));
      featuresReduced.push("Body: " + hexToName(bodyFillColor));

      rangeFloor(0, samples.length);

      if (params.concentric) {
        features.push("Peg style: Bullseye");
        featuresReduced.push("Peg style: Bullseye");
      } else {
        features.push("Peg style: Solid");
        featuresReduced.push("Peg style: Solid");
      }

      if (params.drawAllPoints) {
        rangeFloor(0, leftOver.length);
        //let unusedPegFill = (params.flipConcaveColor ? params.strokeColor : params.backgroundColor)
        if (params.useSecondaryColor) {
          features.push("Extra color: " + hexToName(params.secondaryColor));
          featuresReduced.push(
            "Extra color: " + hexToName(params.secondaryColor)
          );
        } else {
          features.push("Extra color: N/A");
          featuresReduced.push("Extra color: N/A");
        }
      } else {
        features.push("Extra color: N/A");
        featuresReduced.push("Extra color: N/A");
      }

      features.push(
        "Peg count: " + (params.drawAllPoints ? points.length : samples.length)
      );
    }

    /**
     * Helper functions
     */

    function hexToName(hexString) {
      let colMap = {
        "#f5f5f5": "White",
        "#2b2b2b": "Black",
        "#f7f7e6": "Beige",
        "#f2c945": "Yellow",
        "#c3423f": "Red",
        "#4381c1": "Blue",
        "#3b9764": "Green",
      };

      return colMap[hexString];
    }

    function pointsOnGrid(points, padding, cellDimension) {
      for (let i = 0; i < params.gridDimension; i++) {
        let boolFunction = params.offsetGridStarting
          ? i % 2 !== 0
          : i % 2 === 0;
        let offsetter = params.offsetGrid ? (boolFunction ? 1 : 0) : 0;

        for (let j = 0; j < params.gridDimension - offsetter; j++) {
          let cx = padding + (i + 0.5) * cellDimension;
          let cy = padding + (j + 0.5 + offsetter / 2) * cellDimension;
          let r = (cellDimension / 2) * params.radius;
          points.push({ cx, cy, r, originalR: r, i, j, id: points.length });
        }
      }
      return points;
    }

    function pointsOnRecursiveGrid(points, x, y, w, h, iter = 1) {
      let dimW = parseInt(range(2, 4));
      let dimH = dimW;

      let nw = w / dimW;
      let nh = h / dimH;

      for (let nx = x; nx < x + w - 1; nx += nw) {
        for (let ny = y; ny < y + h - 1; ny += nh) {
          if (rnd() < 0.5 && iter < 2) {
            pointsOnRecursiveGrid(points, nx, ny, nw, nh, iter + 1);
          } else {
            let r = (params.radius * Math.min(nw, nh)) / 2;
            points.push({
              r,
              cx: nx + nw / 2,
              cy: ny + nh / 2,
              originalR: r,
              id: points.length,
            });
          }
        }
      }
    }

    // parse parameters
    function setupParametersFromTokenData(token) {
      let hashPairs = [];
      //parse hash
      for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
      }
      // map to 0-255
      return hashPairs.map((x) => {
        return parseInt(x, 16);
      });
    }

    function generateSeedFromTokenData(token) {
      return parseInt(tokenData.slice(0, 16), 16);
    }

    function rnd() {
      seed ^= seed << 13;
      seed ^= seed >> 17;
      seed ^= seed << 5;

      let result = ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
      return result;
    }

    function range(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }

      return rnd() * (max - min) + min;
    }

    function rangeFloor(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.floor(range(min, max));
    }

    function shuffleArray(arr) {
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

    function distance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    function sampleSize(arr, num) {
      if (!Array.isArray(arr)) {
        throw new TypeError("Expected Array, got " + typeof arr);
      }

      if (arr.length < num) {
        throw new TypeError(
          "Array is has less elements than sample size, " +
            arr.length +
            " vs " +
            num
        );
      }

      let shuffled = shuffleArray(arr);

      return { samples: shuffled.slice(0, num), leftOver: shuffled.slice(num) };
    }

    function mapd(n, start1, stop1, start2, stop2) {
      return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    }

    function mapParam(n, start, stop) {
      return mapd(n, 0, 255, start, stop);
    }
  } else if (projectId === 14) {
    let seed = parseInt(tokenData.slice(0, 16), 16);

    class Palette {
      constructor(colors, repeat = 3) {
        this.c = colors;
        this.repeat = repeat;
        this.i = 0;
        this.u = 0;
      }
      increment() {
        if (this.i === this.c.length - 1) {
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

    var PALS = [
      [
        "#F72585",
        "#B5179E",
        "#7209B7",
        "#4361EE",
        "#4361EE",
        "#4895EF",
        "#4CC9F0",
      ],
      ["#FF184C", "#FF184C", "#0A9CF5"],
      ["#E92EFB", "#FF2079", "#440BD4", "#04005E"],
      ["#08F7FE", "#09FBD3", "#FE53BB", "#F5D300"],
      ["#D9EB4B", "#00A9FE", "#FD6BB6", "#EF0888"],
      ["#3B27BA", "#E847AE", "#13CA91", "#FF9472"],
      ["#E96D5E", "#EEEEEE", "#FFE69D", "#6A7E6A", "#393F5F"],
      ["#63345E", "#FD8090", "#B7C1DE", "#06569C", "#092047"],
    ];

    var PAL_C = rnd_choice([
      0,
      1,
      1,
      2,
      2,
      2,
      3,
      3,
      3,
      4,
      4,
      4,
      5,
      5,
      5,
      6,
      6,
      6,
      7,
      7,
      7,
    ]);
    var PAL = PALS[PAL_C];
    var REP = rnd_choice([
      2,
      3,
      3,
      3,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      15,
      20,
      30,
      50,
      100,
    ]);
    var P1 = new Palette(PAL, REP);
    var max_h = rnd_between(10, 50) * M;
    var max_w = rnd_between(10, 50) * M;
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
        rect_partition(x, y, x + w, y + h);
      }
      let sw = rnd_between(0, 0.7) > 0.5;
      let sl = rnd_between(0.1, 0.8);
      if (sw && w > max_w) {
        rr(x, y, w * sl, h);
        rr(x + w * sl, y, w * (1 - sl), h);
      } else if (h > max_h) {
        rr(x, y, w, h * sl);
        rr(x, y + h * sl, w, h * (1 - sl));
      }
    }
    function rescale(e, t, r, i, a) {
      return ((e - t) / (r - t)) * (a - i) + i;
    }
    function range(start, stop, step) {
      var a = [start],
        b = start;
      while (b < stop) {
        a.push((b += step || 1));
      }
      return b > stop ? a.slice(0, -1) : a;
    }
    function rect_partition(x1, y1, x2, y2) {
      let ship = new Ship();
      let sw = rnd_between(1, 15) * M;
      let dyn = rnd_choice([false, true, true]);
      let step = 15 * M;
      let breaks = range(x1, x2, step).slice(rnd_between(1, 5));
      ship.objects.push({
        x: x1,
        y: y1,
        xs: x2 - x1,
        ys: y2 - y1,
        c: P1.color(),
        sw: sw,
        dyn: dyn,
        tl: 0,
      });
      let height = y2 - y1;
      for (let xm of breaks) {
        ship.objects.push({
          x: x1,
          y: y1,
          xs: xm - x1,
          ys: y2 - y1,
          c: P1.color(),
          sw: sw,
          dyn: dyn,
          tl: 0,
        });
        x1 = xm;
      }
      if (
        height < 25 * M &&
        sw < 5 * M &&
        dyn_true &&
        rnd_between(0, 1) < dyn_thresh
      ) {
        ship.dyn = true;
        ship.speed = (1 - rescale(height, 0, 25 * M, 0.7, 0.9)) * M;
      }
      Ships.push(ship);
    }
    function rnd_dec() {
      seed ^= seed << 13;
      seed ^= seed >> 17;
      seed ^= seed << 5;
      return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
    }
    function rnd_between(a, b) {
      return a + (b - a) * rnd_dec();
    }
    function rnd_choice(choices) {
      return choices[Math.floor(rnd_between(0, choices.length * 0.99))];
    }

    var PALS_N = [
      "Cyber",
      "Azure",
      "Viper",
      "Neopunk",
      "Sentinel",
      "Eternity",
      "Voyage",
      "Essence",
    ];
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
      "Color Repeat:" + REP,
    ];

    console.log(features);

    featuresReduced = [
      "Palette:" + PALS_N[PAL_C],
      "State:" + cat(travelers.length, [1], ["Dynamic"], "Static"),
      "Ships:" +
        cat(
          travelers.length,
          [50, 25, 10, 1],
          ["50+", "25-49", "10-24", "1-10"],
          "0"
        ),
    ];

    //console.log(features)
  } else if (projectId === 15) {
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
          ["Black", "Night"],
        ]),
        skyCol = sky[0],
        time = sky[1],
        structList = [
          "Pyramid",
          "Ether",
          "Skyscraper",
          "Laser tower",
          "Nuclear plant",
          "Generator",
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
    console.log(features);
  }

  ///////
  else if (projectId === 16) {
    let hashPairs = [];
    for (let i = 0; i < 32; i++) {
      let hex = tokenData.slice(2 * i + 2, 2 * i + 4);
      hashPairs[i] = parseInt(hex, 16);
    }
    let albers,
      rndcolor,
      blackcorner,
      tinted,
      hline,
      vline,
      circles = false;
    let divs = [
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      6,
      8,
      8,
      8,
      10,
      10,
      10,
      12,
      12,
      12,
      15,
      15,
      15,
      20,
      20,
      20,
      24,
      24,
      24,
      30,
      30,
      30,
      40,
      40,
      60,
      60,
      120,
    ];
    let hdiv, vdiv;
    hdiv =
      divs[Math.floor(hashPairs[0].map(0, 255, 0, divs.length - 0.0000000001))];
    vdiv =
      divs[Math.floor(hashPairs[1].map(0, 255, 0, divs.length - 0.0000000001))];
    if (hdiv === 3 || hdiv === 4) {
      vdiv =
        divs[
          Math.floor(hashPairs[1].map(0, 255, 8, divs.length - 0.0000000001))
        ];
    }
    if (vdiv === 3 || vdiv === 4) {
      hdiv =
        divs[
          Math.floor(hashPairs[0].map(0, 255, 8, divs.length - 0.0000000001))
        ];
    }

    for (let i = 0; i < 61; i++) {
      let hexquad = tokenData.slice(i + 2, i + 6);
      if (hexquad === "a1be" || hexquad === "a1b3") {
        albers = true;
      }
    }
    if (albers) {
      features.push("Albers");
      featuresReduced.push("Albers");
    }
    if (!albers) {
      features.push([hdiv, vdiv].join(" x "));
    }
    if (hashPairs[14] > 250 && !albers) {
      rndcolor = true;
      features.push("Random");
      featuresReduced.push("Random");
    }
    if (hashPairs[14] > 244 && !rndcolor && !albers) {
      features.push("Complementary");
      featuresReduced.push("Complementary");
    }
    if (hashPairs[15] > 248 && !rndcolor && !albers) {
      blackcorner = true;
      features.push("Black Corner");
      featuresReduced.push("Black Corner");
    }
    if (hashPairs[15] > 225 && !blackcorner && !rndcolor && !albers) {
      tinted = true;
      features.push("Tinted");
      featuresReduced.push("Tinted");
    }
    if (
      hashPairs[15] > 202 &&
      !tinted &&
      !blackcorner &&
      !rndcolor &&
      !albers
    ) {
      features.push("Saturated");
      featuresReduced.push("Saturated");
    }
    if (hdiv === vdiv && !albers) {
      if (hashPairs[29] > 127) {
        circles = true;
        features.push("Circles");
        featuresReduced.push("Circles");
      }
    }
    if (hashPairs[30] > 191 && !circles) {
      hline = true;
    }
    if (hashPairs[31] > 191 && !circles) {
      vline = true;
    }
    if (!hline && !vline && !albers) {
      features.push("Adjacent");
      featuresReduced.push("Adjacent");
    }
    if (hline && !vline && !albers) {
      features.push("Horizontal Lines");
      featuresReduced.push("Horizontal Lines");
    }
    if (vline && !hline && !albers) {
      features.push("Vertical Lines");
      featuresReduced.push("Vertical Lines");
    }
    if (hline && vline && !albers) {
      features.push("Grid Lines");
      featuresReduced.push("Grid Lines");
    }
  }

  ////////
  else if (projectId === 17) {
    const getFromHash = (h) => {
      h = h.substr(2);
      let table = [];
      for (let i = 0; i < 16; i++) {
        table[i] =
          parseInt(
            "0x" +
              (h.substr(i + 8, 1) + h.substr(i + 24, 1) + h.substr(i + 40, 1)),
            16
          ) / 4096;
      }
      return table;
    };
    const values = getFromHash(tokenData);
    const E = (value) => {
      return Math.floor(value + 0.5);
    };
    const SF = (value, minRange, maxRange) => {
      return Math.floor(value * (maxRange - minRange) + minRange + 0.5);
    };
    const S = (value, minRange, maxRange) => {
      return value * (maxRange - minRange) + minRange;
    };
    const sh = (v) => {
      return Number.parseFloat(v).toFixed(3);
    };
    const isMonotone = (v) => {
      let monotone = false;
      // If the palette is set to monotone then *it is* monotone
      if (!E((values[12] + values[15]) * 0.5 + 0.2)) {
        monotone = true;
      }
      // v[2] || v[3] might be -1, in case just exclude them
      let colors = [v[0], v[1]];
      if (v[2] >= 0) {
        colors.push(v[2]);
      }
      if (v[3] >= 0) {
        colors.push(v[3]);
      }
      // Otherwise we need to check for color similarities
      let center = 0.41;
      // Check if all under center
      if (colors.every((v) => v <= center)) {
        monotone = true;
      }
      // Check if all over center
      if (colors.every((v) => v > center)) {
        monotone = true;
      }
      return monotone;
    };
    const metadata = {};
    // Orientation
    metadata.orientation = E(values[12] - 0.35)
      ? E(values[10])
        ? "Horizontal"
        : "Vertical"
      : E(values[10])
      ? "Vertical"
      : "Horizontal";
    features.push("Orientation: " + metadata.orientation);
    featuresReduced.push("Orientation: " + metadata.orientation);

    // Palette
    if (E((values[12] + values[15]) * 0.5 + 0.2)) {
      if (E(values[11] - 0.25) == 1) {
        metadata.palette = "Purple-Yellow";
      } else {
        if (S(values[5], 0, 0.07) < 0.03) {
          metadata.palette = "Coral-Teal";
        } else {
          metadata.palette = "Pink–Mint";
        }
      }
    }
    let colors = [values[7], values[6], values[9], values[2]];
    // If LFO is off, the color will just be black.
    if (E(values[12] - 0.4)) {
      colors[2] = -1;
    }
    // If brightness is very low, the color will just look like black.
    if (1 - Math.abs(values[6] - 0.45) >= 0.85) {
      colors[3] = -1;
    }
    if (isMonotone(colors)) {
      metadata.palette = "Monotone";
    }
    features.push("Palette: " + metadata.palette);
    featuresReduced.push("Palette: " + metadata.palette);

    // Modulation frequency
    let mf = SF(values[2], 1, 35);
    if (mf < 8) {
      metadata.modulation_frequency = "Low";
    } else if (mf >= 8 && mf < 15) {
      metadata.modulation_frequency = "Medium";
    } else if (mf >= 15) {
      metadata.modulation_frequency = "High";
    }
    features.push("Frequency modulation: " + metadata.modulation_frequency);
    featuresReduced.push(
      "Frequency modulation: " + metadata.modulation_frequency
    );

    // Bitwise operators
    if (E(values[11]) && E(values[3] + 0.1)) {
      metadata.bitwise = "OR";
    } else if (!E(values[11]) && !E(values[3] + 0.1)) {
      metadata.bitwise = "AND";
    } else {
      metadata.bitwise = "Mixed";
    }
    features.push("Bitwise operators: " + metadata.bitwise);
    featuresReduced.push("Bitwise operators: " + metadata.bitwise);
  }

  ///////
  else if (projectId === 18) {
    let hp = [];
    let hashstring = "";
    let sprite = false;
    let monochrome = false;
    let rainbow = false;
    let log_features = false;

    function mapperz(n, start1, stop1, start2, stop2, withinBounds) {
      const newval =
        ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
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

    hashstring = tokenData.substring(2);
    for (let i = 0; i < hashstring.length / 2; i++) {
      hp[i] = unhex(hashstring.substring(i + i, i + i + 2));
    }

    if (unhex(hashstring[5]) >= 1) {
      if (unhex(hashstring[39]) >= 14) {
        monochrome = true;
        features.push("Gen 2: Monochrome");
        featuresReduced.push("Gen 2: Monochrome");
      } else if (unhex(hashstring[39]) >= 12) {
        rainbow = true;
        features.push("Gen 2: Rainbow");
        featuresReduced.push("Gen 2: Rainbow");
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

    if (!rainbow && !monochrome && !sprite) {
      if (unhex(hashstring[45]) >= 12) {
        if (unhex(hashstring[7]) > 8 || unhex(hashstring[45]) < 12) {
          features.push("Color Accent: Light");
          featuresReduced.push("Color Accent: Light");
        } else {
          features.push("Color Accent: Dark");
          featuresReduced.push("Color Accent: Dark");
        }
      } else {
        features.push("Color Accent: Dark");
        featuresReduced.push("Color Accent: Dark");
      }
    }

    log_features = false;
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

  ///////
  else if (projectId === 19) {
    const r3sonanceFeatures = (hash) => {
      const traits = {
        exec() {
          for (let traitName in this.setup) {
            const trait = this.setup[traitName];
            const p = (trait.prob || 100) / 100;
            if (random() <= p) {
              if ("case" in trait) {
                let totalWeight = 0;
                for (let straitName in trait.case)
                  totalWeight += trait.case[straitName].weight;
                let w = 0;
                const r = random() * totalWeight;
                for (let straitName in trait.case) {
                  const strait = trait.case[straitName];
                  w += strait.weight;
                  if (r <= w) {
                    const result =
                      typeof strait.value === "function"
                        ? strait.value()
                        : strait.value === undefined
                        ? straitName
                        : strait.value;
                    if (result !== null) {
                      this[traitName] = {
                        value: result,
                        prob: p * (strait.weight / totalWeight) * 100,
                        desc: straitName,
                      };
                      this[traitName][straitName] = true;
                    }
                    break;
                  }
                }
              } else {
                const result =
                  typeof trait.value === "function"
                    ? trait.value()
                    : trait.value;
                this[traitName] = {
                  value: result,
                  prob: trait.prob,
                  desc: trait.desc || "",
                };
              }
            }
          }
        },
        log() {
          const f = [];
          for (let t in this) {
            if (t === "setup" || typeof this[t] === "function") continue;
            let d = this[t].desc || "";
            let v = this[t].value || this[t];
            if (typeof v === "object" || d !== "") v = "";
            let line = `${t}: ${d} ${v}`.replace("  ", " ");
            f.push(line);
          }
          return f;
        },
      };
      const RandomGenerator = function (s) {
        let seedA = s;
        return function () {
          seedA ^= seedA << 13;
          seedA ^= seedA >> 17;
          seedA ^= seedA << 5;
          return ((seedA < 0 ? ~seedA + 1 : seedA) % 1000) / 1000;
        };
      };
      const random = RandomGenerator(parseInt(hash.slice(2, 18), 16));
      random();
      const randint = (s, e = 0) => {
        if (e === 0) {
          e = s;
          s = 0;
        }
        return Math.floor(s + random() * (e - s + 1));
      };
      const randpos = (a) => {
        return a[Math.floor(random() * a.length)];
      };
      traits.setup = {
        color: {
          case: {
            monochromatic: { weight: 1, value: 0 },
            red: { weight: 1, value: 0 },
            orangeRed: { weight: 1, value: 15 },
            orange: { weight: 1, value: 30 },
            amber: { weight: 1, value: 45 },
            freeSpeechGreen: { weight: 1, value: 135 },
            aqua: { weight: 1, value: 180 },
            deepSkyBlue: { weight: 1, value: 195 },
            dodgerBlue: { weight: 1, value: 210 },
            blue: { weight: 1, value: 225 },
            hanPurple: { weight: 1, value: 255 },
            torchRed: { weight: 1, value: 345 },
          },
        },
        colorShift: {
          case: {
            complementary: {
              weight: 2,
              value() {
                if (traits.color.monochromatic) return null;
                return 180;
              },
            },
            monochromatic: {
              weight: 1,
              value() {
                if (traits.color.monochromatic) return null;
                return 0;
              },
            },
          },
        },
        type: {
          case: {
            alpha: {
              weight: 60,
              value: true,
            },
            beta: {
              weight: 10,
              value: true,
            },
            gamma: {
              weight: 10,
              value: true,
            },
            delta: {
              weight: 10,
              value: true,
            },
            omega: {
              weight: 10,
              value: true,
            },
          },
        },
        degen: {
          prob: 1,
          value: true,
        },
        panels: {
          case: {
            unfolded: { weight: 95, value: 0 },
            expanded: { weight: 5, value: 1 },
          },
        },
        operation: {
          case: {
            nominal: { weight: 99, value: true },
            disaggregated: { weight: 1, value: true },
          },
        },
        background: {
          case: {
            day: { weight: 30, value: 1 },
            night: { weight: 70, value: 1 },
          },
        },
      };
      traits.exec();
      return traits.log();
    };

    /////////////////////////////////////////////////////////////////////

    features = r3sonanceFeatures(tokenData);
    featuresReduced = r3sonanceFeatures(tokenData);
    console.log(features);
  }

  ///////
  else if (projectId === 20) {
    let seed = parseInt(tokenData.slice(0, 16), 16);

    rnd_bet(0.1, 0.9);
    Math.floor(rnd_bet(1, 9999999999));

    var BGL = "#EEEEEE";
    var BGD = "#08090A";
    PALS = [
      [
        "#1B064C",
        "#F72585",
        "#B5179E",
        "#7209B7",
        "#4361EE",
        "#4361EE",
        "#4895EF",
        "#4CC9F0",
      ],
      [BGL, "#FF0000", "#00A08A", "#F2AD00", "#F98400", "#5BBCD6"],
      [BGL, "#85D4E3", "#F4B5BD", "#CDC08C", "#FAD77B"],
      [BGL, "#E6A0C4", "#C6CDF7", "#D8A499", "#7294D4"],
      [BGL, "#E92EFB", "#FF2079", "#440BD4", "#04005E"],
      [BGL, "#B0305C", "#EB564B", "#73275C"],
      [BGL, "#FF2E63", "#FF9D9D", "#FFC2C2"],
      [BGL, "#363636", "#E8175D"],
      [BGL, "#132743", "#EDC988"],
      [BGD, "#08F7FE", "#09FBD3", "#FE53BB", "#F5D300"],
      [BGD, "#FF184C", "#FF184C", "#0A9CF5"],
      [BGD, "#FFFFEB", "#C2C2D1"],
      [BGD, "#283149", "#A7FF83"],
      [BGD, "#544F63", "#F2D2EC"],
    ];

    var PN = rnd_cho([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var P = PALS[PN];
    PAL = P.slice(1);
    rnd_cho(PAL);
    var CURSOR = rnd_cho(["Cross", "Flat", "Bar"]);

    function rnd_dec() {
      seed ^= seed << 13;
      seed ^= seed >> 17;
      seed ^= seed << 5;
      return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
    }
    function rnd_bet(a, b) {
      return a + (b - a) * rnd_dec();
    }
    function rnd_cho(z) {
      return z[Math.floor(rnd_bet(0, z.length * 0.99))];
    }

    let PLS = [
      "Royalty",
      "Moonrise",
      "Fairy",
      "Budapest",
      "Punk",
      "Rushmore",
      "Peach",
      "Invaders",
      "Knight",
      "Neon",
      "Bleed",
      "Frost",
      "Dearth",
      "Aspen",
    ];

    let BGS = [
      "Royal",
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Night",
      "Night",
      "Night",
      "Night",
      "Night",
    ];

    features = [
      "Palette:" + PLS[PN],
      "Colors:" + (PALS[PN].length - 1),
      "Background:" + BGS[PN],
      "Cursor:" + CURSOR,
    ];
    featuresReduced = ["Palette:" + PLS[PN]];

    console.log(features);
  }

  ///////
  else if (projectId === 22) {
    let rawParams = setupParametersFromTokenData(tokenData);
    // we may need to rename?
    generateSeedFromTokenData(tokenData);

    //console.log(seed);

    let pc = "Bright White";

    let paperColors = [
      "Pink",
      "Canary",
      "Orchid",
      "Pastel Green",
      "Pastel Blue",
      "Ivory",
      "Tan",
      "Warm White",
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
      pc,
    ];

    let bg = pickX(rawParams[0], paperColors);

    let rings = Math.floor(mapParam(rawParams[1], 5, 12)) - 1;

    let smallRings = rings <= 5;

    let palette = pickX(rawParams[7], [
      "Shimmering",
      "Riso",
      "Chill",
      "Flamingo",
      "Golden",
      "Flourescent",
      "Rainbow",
    ]);

    let b = "Bottom",
      t = "Top",
      r = "Right",
      l = "Left";
    let n = "Normal",
      s = "Slow",
      c = "Crawl",
      q = "Quick",
      f = "Fast";

    features.push("Background: " + bg);
    features.push("View: " + (rawParams[10] >= 32 ? "Normal" : "Close-up"));
    features.push("Rings: " + (rings - 1));
    features.push(
      "Position: " +
        pickX(rawParams[2], [
          b + " " + l,
          l,
          t + " " + l,
          b,
          t,
          b + " " + r,
          r,
          t + " " + r,
        ])
    );
    features.push("Speed: " + pickX(rawParams[4], [s, n, n, n, c, n, n, q, f]));
    features.push(
      "Wall: " +
        (smallRings ? (rawParams[5] < 127 ? "Chunky" : "Slim") : "Slim")
    );
    features.push("Vibe: " + (rawParams[6] >= 64 ? "Smooth" : "Rigid"));
    features.push("Palette: " + palette);
    features.push(
      "Amplitude: " + pickX(rawParams[8], ["Less", "Normal", "Extra"])
    );
    features.push("Shape: " + (rawParams[9] < 20 ? "Hexagon" : "Ring"));

    featuresReduced.push("Background: " + bg);
    featuresReduced.push(
      "View: " + (rawParams[10] >= 32 ? "Normal" : "Close-up")
    );
    featuresReduced.push("Rings: " + (rings - 1));
    featuresReduced.push(
      "Position: " +
        pickX(rawParams[2], [
          b + " " + l,
          l,
          t + " " + l,
          b,
          t,
          b + " " + r,
          r,
          t + " " + r,
        ])
    );
    featuresReduced.push(
      "Speed: " + pickX(rawParams[4], [s, n, n, n, c, n, n, q, f])
    );
    featuresReduced.push(
      "Wall: " +
        (smallRings ? (rawParams[5] < 127 ? "Chunky" : "Slim") : "Slim")
    );
    featuresReduced.push("Vibe: " + (rawParams[6] >= 64 ? "Smooth" : "Rigid"));
    featuresReduced.push("Palette: " + palette);
    featuresReduced.push(
      "Amplitude: " + pickX(rawParams[8], ["Less", "Normal", "Extra"])
    );
    featuresReduced.push("Shape: " + (rawParams[9] < 20 ? "Hexagon" : "Ring"));

    function setupParametersFromTokenData(tokenData) {
      let hashPairs = [];
      //parse hash
      for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
      }
      // map to 0-255
      return hashPairs.map((x) => {
        return parseInt(x, 16);
      });
    }

    function generateSeedFromTokenData(tokenData) {
      return parseInt(tokenData.slice(0, 16), 16);
    }

    function pickX(n, ar) {
      return ar[Math.max(0, Math.floor((n / 255) * ar.length - 0.000001))];
    }

    function map(n, s1, st1, s2, st2) {
      return ((n - s1) / (st1 - s1)) * (st2 - s2) + s2;
    }

    function mapParam(n, s, st) {
      return map(n, 0, 255, s, st);
    }
  }

  //////
  else if (projectId === 21) {
    setMetadata(tokenData);

    function setMetadata(hash) {
      const seed = parseInt(hash.substr(-7), 16);
      const colorSeed = seed & 0xfff;
      const segmentSeed = (seed & 0x7f000) >> 12;
      const rSeed =
        ((seed >> 19) & 0xff) === 1 ? 5 : ((seed >> 19) & 0xf) === 1 ? 3 : 4;
      const res =
        rSeed === 5 ? "LoRes 32x32" : rSeed === 3 ? "HiRes 8x8" : "VGA 16x16";

      let glyph = "Glitch";
      switch (segmentSeed) {
        case 0x0:
          glyph = "Ghost";
          break;

        case 0x3f: // A
        case 0x7a: // b
        case 0x53: // C
        case 0x7c: // d
        case 0x5b: // E
        case 0x1b: // F
        case 0x3a: // h
        case 0x74: // J
        case 0x52: // L
        case 0x38: // n
        case 0x1f: // P
        case 0x76: // U
        case 0x3e: // X
        case 0x6e: // y
          glyph = "Alphabetic";
          break;

        case 0x5d: // 2
        case 0x6d: // 3
        case 0x2e: // 4
        case 0x7b: // 6
        case 0x25: // 7
        case 0x6f: // 9
        case 0x36: // 11
          glyph = "Numeric";
          break;

        case 0x12: // I, l, 1
        case 0x24: // I, l, 1
        case 0x77: // O,0
        case 0x6b: // S,5
          glyph = "Alphanumeric";
          break;

        case 0x7f:
          glyph = "Lucky 8";
          break;

        case 0x46:
          glyph = "OTTO";
          break;
      }

      let pattern = "Mix";
      let p1 = colorSeed & 0x7;
      let p2 = (colorSeed & (0x7 << 3)) >> 3;
      let p3 = (colorSeed & (0x7 << 6)) >> 6;
      let p4 = (colorSeed & (0x7 << 9)) >> 9;

      let black_white = 0;

      if (p1 === 0 && p2 === 0 && p3 === 0 && p4 === 0) {
        if (segmentSeed === 0) {
          pattern = "Blackout";
        } else {
          pattern = "Binary";
        }
      } else if (p1 === 7 && p2 === 7 && p3 === 7 && p4 === 7) {
        pattern = "Whiteout";
      } else if (p1 === p2 && p2 === p3 && p3 === p4) {
        pattern = "Solid";
      } else if (
        (p1 === 0 || p1 === 7) &&
        (p2 === 0 || p2 === 7) &&
        (p3 === 0 || p3 === 7) &&
        (p4 === 0 || p4 === 7)
      ) {
        // Black & White
        black_white = 1;
      }

      if (p1 === p3 && p2 === p4 && p1 !== p2) {
        pattern = "Bars";
      }

      if (p1 === p2 && p3 === p4 && p1 !== p3) {
        if (p1 === 0 || p3 === 0) {
          pattern = "Scanlines";
        } else {
          pattern = "Stripes";
        }
      }

      if (p1 === p4 && p2 === p3 && p1 !== p2) {
        pattern = "Checkerboard";
      }

      if (
        (p1 === p2 && p1 === p3 && p1 !== p4) ||
        (p1 !== p2 && p1 === p3 && p1 === p4) ||
        (p1 === p2 && p1 !== p3 && p1 === p4) ||
        (p1 !== p2 && p2 === p3 && p2 === p4)
      ) {
        pattern = "Pointillist";
      }

      switch (colorSeed) {
        case (7 << 9) + (3 << 6) + (6 << 3) + 2:
        case (7 << 9) + (6 << 6) + (3 << 3) + 2:
        case (3 << 9) + (7 << 6) + (2 << 3) + 6:
        case (3 << 9) + (2 << 6) + (7 << 3) + 6:
        case (6 << 9) + (7 << 6) + (2 << 3) + 3:
        case (6 << 9) + (2 << 6) + (7 << 3) + 3:
        case (2 << 9) + (6 << 6) + (3 << 3) + 7:
        case (2 << 9) + (3 << 6) + (6 << 3) + 7:
          pattern = "Highlighter";
          break;
      }

      features.push(`Glyph: ${glyph}`);
      featuresReduced.push(`Glyph: ${glyph}`);
      features.push(`Resolution: ${res}`);
      featuresReduced.push(`Resolution: ${res}`);
      features.push(`Pattern: ${pattern}`);
      featuresReduced.push(`Pattern: ${pattern}`);
      features.push(`Black & White: ${black_white ? "Yes" : "No"}`);
      featuresReduced.push(`Black & White: ${black_white ? "Yes" : "No"}`);
    }
  }
  ///////
  else if (projectId === 23) {
    let seed = generateSeedFromTokenData(tokenData);

    const rng = rnd;

    const layout =
      "Layout: " + w_pick(["Chaos", "Balance", "Order"], [1, 4, 2]);

    const shade =
      "Shading: " +
      w_pick(
        [
          "Noon",
          "Morning",
          "Evening",
          "Bright",
          "Bright Morning",
          "Bright Evening",
        ],
        [5, 1, 1, 0.5, 1, 1]
      );

    const is_bright = shade.includes("Bright");
    const scene =
      "Scene : " +
      (is_bright && rng() < 0.25 ? (rng() < 0.25 ? "Cube" : "Corner") : "Flat");
    const colorStrat =
      "Coloring strategy: " +
      w_pick(["Group", "Main", "Single", "Random"], [4, 2, 1, 2]);
    const palette = "Palette: " + get_palette();

    const framed = "Framed: " + (rng() < 0.95 ? "Yep" : "Nope!");

    features.push(layout, shade, scene, colorStrat, palette, framed);
    featuresReduced.push(layout, shade, scene, colorStrat, palette, framed);

    // -----

    function rnd() {
      seed ^= seed << 13;
      seed ^= seed >> 17;
      seed ^= seed << 5;

      const n = ((seed < 0 ? ~seed + 1 : seed) % 100000) / 100000;
      return n === 0 || n === 1 ? 0.5 : n;
    }

    function range(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }

      return rng() * (max - min) + min;
    }

    function rangeFloor(min, max) {
      return Math.floor(range(min, max));
    }

    function pick(array) {
      if (array.length === 0) return undefined;
      return array[rangeFloor(0, array.length)];
    }

    function w_pick(arr, warr) {
      const agg = warr.reduce((a, c) => [...a, a[a.length - 1] + c], [0]);
      const t = range(agg[agg.length - 1]);
      const i = agg.findIndex((el) => el > t) - 1;
      return arr[i];
    }

    function generateSeedFromTokenData(tokenData) {
      return parseInt(tokenData.slice(0, 16), 16);
    }

    function get_palette() {
      const palettes = [
        ["Shelter", 0.5],
        ["Verena", 2],
        ["Punk", 1],
        ["Sprague", 1],
        ["Revolucion", 2],
        ["Miradors", 0.2],
        ["Hurdles", 0.5],
        ["Romeo", 1],
        ["Rosewood", 1],
        ["Mysore", 2],
        ["Bangalore", 1],
        ["Ducci", 0.2],
        ["Mural", 1],
        ["Docks", 1],
        ["Mono", 0.2],
        ["Tropico", 1],
        ["Jolly", 1],
        ["Arcade", 1],
        ["Cold Duo", 1],
        ["Warm Duo", 1],
        ["Golden Duo", 0.2],
        ["Hotshot", 3],
        ["Hotspot", 3],
        ["Honeypot", 1],
        ["Main Course", 1],
        ["Mantis", 1],
        ["Delphi", 1],
        ["Nowak", 1],
        ["Cherfi", 1],
        ["Alpha Dog", 0.5],
        ["Spider King", 0.1],
        ["Atlas", 3],
        ["Giftcard", 2],
        ["Paddle", 1],
        ["Nightlife", 1],
        ["Slapdash", 1],
        ["Truce", 1],
        ["Yellow Spider", 2],
        ["Blue Spider", 2],
        ["Red Spider", 2],
        ["Green Spider", 2],
        ["Pink Spider", 2],
      ];

      return w_pick(
        palettes.map((a) => a[0]),
        palettes.map((a) => a[1])
      );
    }
  }

  //////
  else if (projectId === 24) {
    let o = getMetadata(tokenData);
    features.push(`Tint: ${o.tint}`);
    featuresReduced.push(`Tint: ${o.tint}`);
    features.push(`Infused: ${o.infused}`);
    featuresReduced.push(`Infused: ${o.infused}`);

    function getMetadata(hash) {
      let rand_01 = parseInt(hash.substr(-1, 1), 16);
      let infused = rand_01 > 0 ? false : true;
      let hueVariation = infused ? 360 : 60;
      let rand_02 = parseInt(hash.substr(-3, 2), 16) / 256;
      let hue = 204 + parseInt(rand_02 * hueVariation - hueVariation / 2);

      let tint = hue < 36 ? "Fire" : "";
      tint = hue >= 36 && hue <= 63 ? "Goldenrod" : tint;
      tint = hue >= 64 && hue <= 133 ? "Electric" : tint;
      tint = hue === 73 ? "Emerald Dragon" : tint;
      tint = hue >= 134 && hue <= 171 ? "Froggy" : tint;
      tint = hue >= 172 && hue <= 181 ? "Turquoise" : tint;
      tint = hue >= 182 && hue <= 191 ? "Sky" : tint;
      tint = hue >= 192 && hue <= 211 ? "Cobalt" : tint;
      tint = hue >= 212 && hue <= 255 ? "Royal" : tint;
      tint = hue >= 256 && hue <= 281 ? "Regal" : tint;
      tint = hue >= 282 && hue <= 323 ? "Neon" : tint;
      tint = hue >= 324 && hue <= 333 ? "Sexbomb" : tint;
      tint = hue > 333 ? "Lipstick" : tint;

      let o = {
        tint: tint,
        infused: infused ? "Yes" : "No",
      };
      return o;
    }
  }

  /////////
  else if (projectId === 26) {
    let hashPairs = [];

    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }

    let decPairs = hashPairs.map((x) => {
      return parseInt(x, 16);
    });

    let motionStates = ["Zen", "Flow", "Turbulent"];

    let ranSpeed = Math.round(decPairs[1].map(0, 255, 1, 3));
    let speed = 0;
    if (ranSpeed == 1) {
      speed = 0;
    }
    if (ranSpeed == 2) {
      speed = 1;
    }
    if (ranSpeed == 3) {
      speed = 2;
    }

    var speedVar = motionStates[speed];

    let delayMode = ["TheNow", "Slacker", "TimeBlurb"];

    let ranDelay = Math.round(decPairs[0].map(0, 255, 1, 3));
    let delay = 0;
    if (ranDelay == 1) {
      delay = 0;
    }
    if (ranDelay == 2) {
      delay = 1;
    }
    if (ranDelay == 3) {
      delay = 2;
    }

    var delayM = delayMode[delay];

    let dimensionalBalance = ["Balanced", "Unstable"];

    let ranDim = Math.round(decPairs[3].map(0, 255, 0, 1));
    let dimB = 0;
    if (ranDim == 0) {
      dimB = 0;
    }
    if (ranDim == 1) {
      dimB = 1;
    }

    var dimBalance = dimensionalBalance[dimB];

    let colorBase = decPairs[2];

    features = [
      "MotionState: " + speedVar,
      "DelayMode: " + delayM,
      "DimensionalBalance: " + dimBalance,
      "ColorBase(0-255): " + String(colorBase),
    ];
    featuresReduced = [
      "MotionState: " + speedVar,
      "DelayMode: " + delayM,
      "DimensionalBalance: " + dimBalance,
    ];
  }
  /////
  else if (projectId === 25) {
    let hashPairs = [];

    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }

    let decPairs = hashPairs.map((x) => {
      return parseInt(x, 16);
    });

    let ranGrid = decPairs[0].map(0, 255, 0, 100);
    let gridSize;
    if (ranGrid <= 33) {
      gridSize = "small";
    } else if (ranGrid > 33 && ranGrid <= 69) {
      gridSize = "medium";
    } else if (ranGrid < 69 && ranGrid <= 84) {
      gridSize = "large";
    } else {
      gridSize = "large";
    }

    let ranPalette = decPairs[1].map(0, 255, 1, 100);
    let palette;
    if (ranPalette <= 8) {
      palette = "Light Palette";
    } else if (ranPalette > 8 && ranPalette <= 16) {
      palette = "Dark Palette";
    } else if (ranPalette > 16 && ranPalette <= 20) {
      palette = "Emerald Palette";
    } else if (ranPalette > 20 && ranPalette <= 25) {
      palette = "Cream Palette";
    } else if (ranPalette > 25 && ranPalette <= 30) {
      palette = "Sky Palette";
    } else if (ranPalette > 30 && ranPalette <= 35) {
      palette = "Rose Palette";
    } else if (ranPalette > 35 && ranPalette <= 40) {
      palette = "Overcast Palette";
    } else if (ranPalette > 40 && ranPalette <= 45) {
      palette = "Steel Palette";
    } else if (ranPalette > 45 && ranPalette <= 50) {
      palette = "Jasmine Palette";
    } else if (ranPalette > 50 && ranPalette <= 52) {
      palette = "Terminal Palette";
    } else if (ranPalette > 52 && ranPalette <= 57) {
      palette = "Bubblegum Palette";
    } else if (ranPalette > 57 && ranPalette <= 62) {
      palette = "Neon Palette";
    } else if (ranPalette > 62 && ranPalette <= 67) {
      palette = "Ice Palette";
    } else if (ranPalette > 67 && ranPalette <= 72) {
      palette = "Forest Palette";
    } else if (ranPalette > 72 && ranPalette <= 76) {
      palette = "Adobe Palette";
    } else if (ranPalette > 76 && ranPalette <= 82) {
      palette = "Muted Violet Palette";
    } else if (ranPalette > 82 && ranPalette <= 85) {
      palette = "Terminal Blue Palette";
    } else if (ranPalette > 85 && ranPalette <= 90) {
      palette = "Unicorn Palette";
    } else if (ranPalette > 90 && ranPalette <= 95) {
      palette = "Dusted Orange Palette";
    } else {
      palette = "Bumblebee Palette";
    }

    /* In Pathfinders.js I use my own mapRange function because these variables are declared outside of p5. Like so:
function mapRange(value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}
let featurePrimaryBrushStroke = Math.floor(mapRange(decPairs[15], 0, 255, 0, 9))
let featureSecondaryBrushStroke = Math.floor(mapRange(decPairs[16], 0, 255, 0, 3))
//Is your math going to be the same as mine?
*/

    let primaryBrushVariant = Math.floor(decPairs[15].map(0, 255, 0, 9));
    let secondaryBrushVariant = Math.floor(decPairs[16].map(0, 255, 0, 3));

    features = [
      "Start Screen Grid Size: " + gridSize,
      "Color Palette: " + palette,
      "Primary Brush Variant: " + primaryBrushVariant,
      "Secondary Brush Variant:  " + secondaryBrushVariant,
    ];
    featuresReduced = [
      "Start Screen Grid Size: " + gridSize,
      "Color Palette: " + palette,
      "Primary Brush Variant: " + primaryBrushVariant,
      "Secondary Brush Variant:  " + secondaryBrushVariant,
    ];
  }

  /////////////////////////

  if (projectId === 27) {
    const noise = {
      init(seed) {
        this.r = this.alea(seed);
        this.p = this.bp(this.r);
      },
      bp(random) {
        var i;
        var p = new Uint8Array(256);
        for (i = 0; i < 256; i++) {
          p[i] = i;
        }
        for (i = 0; i < 255; i++) {
          var r = i + ~~(random() * (256 - i));
          var aux = p[i];
          p[i] = p[r];
          p[r] = aux;
        }
        return p;
      },

      masher() {
        var n = 0xefc8249d;
        return function (data) {
          data = data.toString();
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
          }
          return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
        };
      },
      alea() {
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;

        var mash = this.masher();
        s0 = mash(" ");
        s1 = mash(" ");
        s2 = mash(" ");

        for (var i = 0; i < arguments.length; i++) {
          s0 -= mash(arguments[i]);
          if (s0 < 0) {
            s0 += 1;
          }
          s1 -= mash(arguments[i]);
          if (s1 < 0) {
            s1 += 1;
          }
          s2 -= mash(arguments[i]);
          if (s2 < 0) {
            s2 += 1;
          }
        }
        mash = null;
        return function () {
          var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
          s0 = s1;
          s1 = s2;
          return (s2 = t - (c = t | 0));
        };
      },
    };

    const F = (n) => new Float32Array(n);
    const PI = Math.PI;
    const TAU = PI * 2;
    const cos = Math.cos;
    const sin = Math.sin;
    const sq = Math.sqrt;
    const fl = Math.floor;
    const ceil = Math.ceil;
    const abs = Math.abs;

    noise.init(42);
    let timeArray = [];
    for (let i = 0; i < 720; ++i) {
      timeArray.push(i);
    }
    let currentIndex = timeArray.length;
    while (0 !== currentIndex) {
      let randomIndex = fl(noise.r() * currentIndex);
      currentIndex -= 1;
      let temp = timeArray[currentIndex];
      timeArray[currentIndex] = timeArray[randomIndex];
      timeArray[randomIndex] = temp;
    }
    //reset the noise!
    noise.init(tokenData);
    //no more random!
    const rd = noise.r; //Math.random;

    //color palette choice
    let palette_index = fl(rd() * 27); //uniform
    //repeat of palette?
    let repeat = 1;
    if (rd() > 0.95) repeat = 2; //5% of repeats

    //additive blending
    let additive = rd() > 0.3; //70% additive;
    //blur in or out
    let blurfac = 0.99; //2
    if (rd() > 0.6) blurfac = 1.01; // 60% outwards

    //how huge we move
    let scale_noise = 2.0 + rd() * 2.5; //does not matter

    //shape of the outer ring
    let n_sides = 100; //circle 30%
    let ns = rd();
    //shape less version
    if (ns > 0.9) n_sides = -1;
    //10% full screen
    else if (ns > 0.3) n_sides = fl(rd() * 4) + 3; // 3 to 6
    //60% shaped

    //shape of the inner ring
    let n_sides2 = 100; //circle
    if (rd() > 0.5 || n_sides == 100) n_sides2 = fl(rd() * 4) + 3; //50% shape inside

    //number of rings
    let n_rings = 20;
    if (rd() > 0.95) n_rings = 400;
    //5% ringless
    //the ringless version //2
    else if (rd() > 0.9) n_rings = -1; //the spiral version 10% the spiral

    //sparkle effect
    let sparkle = rd() > 0.7; //30% sparkle

    //huge particles, huge size
    let huge = !(rd() > 0.2 || n_sides == -1); //20% huge

    //type of noise movement
    let typeMove = 0; //50% type0
    let tmr = rd();
    if (tmr > 0.8) typeMove = 1;
    //20% type1
    else if (tmr > 0.6) typeMove = 2;
    //20% type2
    else if (tmr > 0.5) typeMove = 3; //10% type3

    //color distribution
    let radialPattern = 0; //for the colors
    tmr = rd();
    if (tmr > 0.9) radialPattern = 2;
    //10%
    else if (tmr > 0.8) radialPattern = 1; // 10%

    //special effect
    let crazyRot = rd() > 0.95 && n_sides >= 0; //5% onls

    //donut or centerless
    let centerLess = 0; //70% full
    if (rd() > 0.7) {
      if (rd() > 0.333) centerLess = 2;
      //20% //center
      else centerLess = 1; //10% //donut
    }

    //radial lines
    let radialLines = rd() > 0.6 && n_rings < 30; //60% flat
    //radial lines can also spiral
    let spiral = rd() > 0.5; //50% for colors

    //interpolate with inner
    let hybrid = rd() > 0.3; //70% hybrid

    //only update half
    let lazy = rd() > 0.9;

    //compute the special time
    let lastDigits = parseInt((tokenId + "").substr(-4));
    let specialTime = timeArray[lastDigits % 720];
    let specialMinute = specialTime % 60;
    let specialHour = (specialTime - specialMinute) / 60;

    //let features = [];
    if (repeat == 1) {
      features.push("See Double Colors: No"); //0
      featuresReduced.push("See Double Colors: No"); //0
    } else {
      features.push("See Double Colors: Yes");
      featuresReduced.push("See Double Colors: Yes");
    }
    if (blurfac >= 1) {
      features.push("Personality: Introvert"); //1
      featuresReduced.push("Personality: Introvert"); //1
    } else {
      features.push("Personality: Extrovert");
      featuresReduced.push("Personality: Extrovert");
    }
    if (crazyRot) {
      features[1] = "Personality: Warp";
      featuresReduced[1] = "Personality: Warp";
    }
    if (additive) {
      features.push("Brightness: Shiny"); //2
      featuresReduced.push("Brightness: Shiny"); //2
    } else {
      features.push("Brightness: Flat");
      featuresReduced.push("Brightness: Flat");
    }
    switch (n_sides) {
      case 3:
        features.push("Shape: Triangle"); //3
        featuresReduced.push("Shape: Triangle"); //3
        break;
      case 4:
        features.push("Shape: Square");
        featuresReduced.push("Shape: Square");
        break;
      case 5:
        features.push("Shape: Pentagon");
        featuresReduced.push("Shape: Pentagon");
        break;
      case 6:
        features.push("Shape: Hexagon");
        featuresReduced.push("Shape: Hexagon");
        break;
      case -1:
        features.push("Shape: Shapeless");
        featuresReduced.push("Shape: Shapeless");
        break;
      default:
        features.push("Shape: Circle");
        featuresReduced.push("Shape: Circle");
        break;
    }
    switch (n_sides2) {
      case 3:
        features.push("Inner Shape: Triangle"); //4
        featuresReduced.push("Inner Shape: Triangle"); //4
        break;
      case 4:
        features.push("Inner Shape: Square");
        featuresReduced.push("Inner Shape: Square");
        break;
      case 5:
        features.push("Inner Shape: Pentagon");
        featuresReduced.push("Inner Shape: Pentagon");
        break;
      case 6:
        features.push("Inner Shape: Hexagon");
        featuresReduced.push("Inner Shape: Hexagon");
        break;
      case -1:
        features.push("Inner Shape: Shapeless");
        featuresReduced.push("Inner Shape: Shapeless");
        break;
      default:
        features.push("Inner Shape: Circle");
        featuresReduced.push("Inner Shape: Circle");
        break;
    }
    if (hybrid) {
      if (n_sides2 == n_sides) {
        features.push("Type: Simple");
        featuresReduced.push("Type: Simple");
        //features.innerShape="N/A";
        features[4] = "Inner Shape: N/A";
        featuresReduced[4] = "Inner Shape: N/A";
      } else {
        features.push("Type: Hybrid"); //5
        featuresReduced.push("Type: Hybrid"); //5
      }
    } else {
      features.push("Type: Simple");
      featuresReduced.push("Type: Simple");
      features[4] = "Inner Shape: N/A";
      featuresReduced[4] = "Inner Shape: N/A";
      //features.innerShape="N/A";
    }

    if (huge) {
      features.push("Size: Huge"); //6
      featuresReduced.push("Size: Huge"); //6
    } else {
      features.push("Size: Regular");
      featuresReduced.push("Size: Regular");
    }
    if (sparkle) {
      features.push("Sparkles: Yes"); //7
      featuresReduced.push("Sparkles: Yes"); //7
    } else {
      features.push("Sparkles: No");
      featuresReduced.push("Sparkles: No");
    }
    switch (typeMove) {
      case 0:
        features.push("Movement: Flow"); //8
        featuresReduced.push("Movement: Flow"); //8
        break;
      case 1:
        features.push("Movement: Loops");
        featuresReduced.push("Movement: Loops");
        break;
      case 2:
        features.push("Movement: Broken Loops");
        featuresReduced.push("Movement: Broken Loops");
        break;
      case 3:
        features.push("Movement: Ripples");
        featuresReduced.push("Movement: Ripples");
        break;
      default:
        break;
    }
    if (scale_noise > 4.0) {
      features.push("Speed: Excited"); //9
      featuresReduced.push("Speed: Excited"); //9
      //features.speed="Excited";
    } else if (scale_noise > 3.0) {
      features.push("Speed: Normal");
      featuresReduced.push("Speed: Normal");
      //features.speed="Normal";
    } else {
      features.push("Speed: Smooth");
      featuresReduced.push("Speed: Smooth");
      //features.speed="Smooth";
    }

    switch (n_rings) {
      case 400:
        //features.fill="Solid";
        features.push("Fill: Solid"); //10
        featuresReduced.push("Fill: Solid"); //10
        break;
      case 20:
        //features.fill="Rings";
        features.push("Fill: Rings");
        featuresReduced.push("Fill: Rings");
        break;
      case -1:
        //features.fill="Spiral";
        features.push("Fill: Spiral");
        featuresReduced.push("Fill: Spiral");
        break;
      default:
        break;
    }
    if (radialLines) {
      features[10] = "Fill: Radial Lines";
      featuresReduced[10] = "Fill: Radial Lines";
    }

    switch (radialPattern) {
      case 0:
        features.push("Colors: Concentric"); //11
        featuresReduced.push("Colors: Concentric"); //11
        //features.colors="Concentric"
        break;
      case 1:
        features.push("Colors: Radial Lines"); //11
        featuresReduced.push("Colors: Radial Lines"); //11
        //features.colors="Radial lines"
        break;
      case 2:
        //features.colors="Spiral"
        features.push("Colors: Spiral"); //11
        featuresReduced.push("Colors: Spiral"); //11
        break;
    }
    if (n_sides == -1) {
      if (spiral) {
        features[11] = "Colors: Spiral";
        featuresReduced[11] = "Colors: Spiral";
      }
    }

    switch (centerLess) {
      case 0:
        //features.wholeness="100%"
        features.push("Wholeness: 100%"); //12
        featuresReduced.push("Wholeness: 100%"); //12
        break;
      case 1:
        features.push("Wholeness: Donut"); //12
        featuresReduced.push("Wholeness: Donut"); //12
        //features.wholeness="Donut"
        break;
      case 2:
        features.push("Wholeness: Hole"); //12
        featuresReduced.push("Wholeness: Hole"); //12
        //features.wholeness="Hole"
        break;
    }

    if (spiral) {
      //features.spin='True';
      features.push("Spin: Yes"); //13
      featuresReduced.push("Spin: Yes"); //13
    } else {
      //features.spin='False';
      features.push("Spin: No"); //13
      featuresReduced.push("Spin: No"); //13
    }

    if (lazy) {
      features.push("Energy: Lazy"); //14
      featuresReduced.push("Energy: Lazy"); //14
      //features.energy='Lazy';
    } else {
      features.push("Energy: Normal"); //14
      featuresReduced.push("Energy: Normal"); //14
      //features.energy='Normal';
    }
    features.push("Time: " + specialHour + ":" + specialMinute); //15
    //features.time=specialHour+":"+specialMinute;

    let palettes = [
      "Monochrome",
      "Sunset",
      "Purple Touch",
      "Rocky Earth",
      "Feeling Lucky?",
      "Golden Blues",
      "Autumn Leaves",
      "Down to Earth",
      "Red vs Blue",
      "Boy and Girl",
      "Landscape",
      "Red won",
      "Icy Blues",
      "Green Earth",
      "Blue Earth",
      "Not for the weak",
      "Dark and Stormy",
      "Light and Dreamy",
      "Purple Moss",
      "Burning",
      "Purple Maze",
      "Sunny Beach",
      "Precious Rock",
      "LEDs",
      "Muted",
      "Calm Sea",
      "Dark Rainbow",
    ];
    features.push("Palette: " + palettes[palette_index]);
    featuresReduced.push("Palette: " + palettes[palette_index]);
    //features.palette= palettes[palette_index];

    //console.log(features);

    //console.log(features);
  }
  //console.log(features);
  else if (projectId === 1) {
    //console.log('hit');
    let hp = [];
    let hashstring = "";
    hashstring = tokenData.substring(2);
    for (let i = 0; i < hashstring.length / 2; i++) {
      hp.push(unhex(hashstring.substring(i + i, i + i + 2)));
    }

    //begin features collection
    if (hp[2] > 150) {
      features.push("Grid: Diagonal");
      featuresReduced.push("Grid: Diagonal");
      //diagonal grid
    } else if (hp[2] > 85) {
      features.push("Grid: Standard");
      featuresReduced.push("Grid: Standard");
    } else {
      features.push("Grid: None");
      featuresReduced.push("Grid: None");
    }
    if (hp[8] > 0 && hp[8] < 85) {
      features.push("rect1: 5-count");
      featuresReduced.push("rect1: 5-count");
    } else if (hp[8] > 84 && hp[8] < 170) {
      features.push("rect1: 3-count");
      featuresReduced.push("rect1: 3-count");
    } else {
      features.push("rect1: 1-count");
      featuresReduced.push("rect1: 1-count");
    }
    if (R(hp[14]) == 10) {
      features.push("line: constellations");
      featuresReduced.push("line: constellations");
    } else if (R(hp[14]) == 11) {
      features.push("dots: white sprinkles");
      featuresReduced.push("dots: white sprinkles");
    } else if (R(hp[14]) == 12) {
      features.push("line: white scribbles");
      featuresReduced.push("line: white scribbles");
    } else if (R(hp[14]) == 13) {
      features.push("line: few white");
      featuresReduced.push("line: few white");
    } else if (R(hp[14]) == 14) {
      features.push("line: black scribbles");
      featuresReduced.push("line: black scribbles");
    } else if (R(hp[14]) == 15) {
      features.push("line: pickup-sticks");
      featuresReduced.push("line: pickup-sticks");
    } else if (R(hp[14]) == 16) {
      features.push("dots: soft points");
      featuresReduced.push("dots: soft points");
    } else if (R(hp[14]) == 17) {
      if (R(hp[16]) > 1) {
        features.push("dots: white sprinkles ");
        featuresReduced.push("dots: white sprinkles ");
      }
    } else if (R(hp[14]) == 18) {
      features.push("line: colored sprinkles");
      featuresReduced.push("line: colored sprinkles");
    } else if (R(hp[14]) == 19) {
      features.push("curve: glowing bezier");
      featuresReduced.push("curve: glowing bezier");
    } else if (R(hp[14]) == 20) {
      features.push("special: everything");
      featuresReduced.push("special: everything");
    } else if (R(hp[14]) == 21) {
      features.push("line: constellations");
      featuresReduced.push("line: constellations");
    } else if (R(hp[14]) > 21 && R(hp[14]) < 28) {
      if (hp[1] > 10) {
        features.push("line: pickup-sticks");
        featuresReduced.push("line: pickup-sticks");
      }
    }
    if (hp[20] > 0 && hp[20] < 85) {
      features.push("rect2: 5-count");
      featuresReduced.push("rect2: 5-count");
    } else if (hp[20] > 84 && hp[20] < 170) {
      features.push("rect2: 3-count");
      featuresReduced.push("rect2: 3-count");
    } else {
      features.push("rect2: 1-count");
      featuresReduced.push("rect2: 1-count");
    }
    if (hp[26] > 210) {
      features.push("trapezoid: black");
      featuresReduced.push("trapezoid: black");
    } else if (hp[26] > 168) {
      features.push("trapezoid: colored");
      featuresReduced.push("trapezoid: colored");
    } else if (hp[26] > 126) {
      features.push("triangle2: filled");
      featuresReduced.push("triangle2: filled");
    } else if (hp[26] > 84) {
      features.push("trapezoid: colored");
      featuresReduced.push("trapezoid: colored");
    } else if (hp[26] > 42) {
      features.push("curve: bezier");
      featuresReduced.push("curve: bezier");
    } else {
      features.push("trapezoid: white");
      featuresReduced.push("trapezoid: white");
    }
    features.push("triangle1: all");
    featuresReduced.push("triangle1: all");

    //print features to console
    for (let i = 0; i < features.length; i++) {
      console.log(features[i]);
    }

    // maps the hp to a value between 0 and 32
    function R(_num) {
      return Math.floor(mapperz(_num, 0, 255, 0, 32));
    }

    //vanilla js replacement for the p5.js map function
    function mapperz(n, start1, stop1, start2, stop2, withinBounds) {
      const newval =
        ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
      if (!withinBounds) {
        return newval;
      }
      if (start2 < stop2) {
        return this.constrain(newval, start2, stop2);
      } else {
        return this.constrain(newval, stop2, start2);
      }
    }

    function unhex(n) {
      return parseInt(`0x${n}`, 16);
    }
  }
  ///////
  else if (projectId === 28) {
    rv = hti(tokenData);
    function hti(e) {
      let v = [];
      for (let e = 0; e < 32; e++)
        v.push(tokenData.slice(2 + 2 * e, 4 + 2 * e));
      return v.map((e) => parseInt(e, 16));
    }

    let positioning = "Positioning: ";
    if (map_v(0) < 0.15) {
      positioning += "Horizontal";
    } else if (map_v(0) < 0.3) {
      positioning += "Vertical";
    } else {
      positioning += "Floating";
    }

    let colors =
      "Colors: " +
      (map_v(1) < 0.005
        ? "Light"
        : map_v(1) < 0.01
        ? "Darkness"
        : map_v(1) < 0.02
        ? "Basil Gogos"
        : map_v(1) < 0.1
        ? "Riley"
        : map_v(1) < 0.3
        ? "The Oracle"
        : map_v(1) < 0.48
        ? "Three Fates"
        : map_v(1) < 0.52
        ? "Phoenix"
        : map_v(1) < 0.57
        ? "Sands"
        : map_v(1) < 0.61
        ? "Reds"
        : map_v(1) < 0.62
        ? "South Beach"
        : map_v(1) < 0.64
        ? "Energy"
        : map_v(1) < 0.66
        ? "Laguna"
        : map_v(1) < 0.69
        ? "Slayer"
        : map_v(1) < 0.7
        ? "North Bend"
        : map_v(1) < 0.72
        ? "Modern Royalty"
        : map_v(1) < 0.75
        ? "Salt of the Earth"
        : map_v(1) < 0.77
        ? "Thaddeus"
        : map_v(1) < 0.79
        ? "Uncertainty"
        : map_v(1) < 0.8
        ? "Silverado"
        : map_v(1) < 0.81
        ? "Certainty"
        : map_v(1) < 0.82
        ? "Young Again"
        : map_v(1) < 0.86
        ? "Caruthers"
        : map_v(1) < 0.87
        ? "Tinkham"
        : map_v(1) < 0.88
        ? "Morning"
        : map_v(1) < 0.9
        ? "Hope"
        : map_v(1) < 0.92
        ? "Squidgit"
        : map_v(1) < 0.94
        ? "BB"
        : map_v(1) < 0.95
        ? "Stargazer"
        : "Zephyr");

    let stretch = "Stretch: ";
    if (map_v(2, 100, 300) <= 150) {
      stretch += "Taffy";
    } else if (map_v(2, 100, 300) >= 250) {
      stretch += "Compressed";
    } else {
      stretch += "Smooth";
    }

    let spook = "Spook: ";
    if (map_v(5, 0.005, 0.03) <= 0.01) {
      spook += "Calm";
    } else if (map_v(5, 0.005, 0.03) >= 0.025) {
      spook += "Panic";
    } else {
      spook += "Don't Panic";
    }

    let reach = "Reach: ";
    if (map_v(6, 0.1, 0.3) <= 0.15) {
      reach += "Near";
    } else if (map_v(6, 0.1, 0.3) >= 0.25) {
      reach += "Far";
    } else {
      reach += "Arm's Length";
    }

    let altitude = "Altitude: ";
    if (map_v(7, 0.1, 0.3) <= 0.15) {
      altitude += "Sea Level";
    } else if (map_v(7, 0.1, 0.3) >= 0.25) {
      altitude += "Stratosphere";
    } else {
      altitude += "Troposhere";
    }

    let bands = "Bands: ";
    if (map_v(10) < 0.3) {
      bands += "Solid";
    } else if (Math.round(map_v(8, 10, 200)) <= 50) {
      bands += "Narrow";
    } else if (Math.round(map_v(8, 10, 200)) >= 170) {
      bands += "Broad";
    } else {
      bands += "FM";
    }

    let backdrop = "Backdrop: " + (map_v(9) < 0.5 ? "Square" : "Circle");
    let brush_style = "Brush Style: " + (map_v(10) < 0.3 ? "Solid" : "Blended");
    let backdrop_style =
      "Backdrop Style: " + (map_v(11) < 0.5 ? "Traced" : "Filled");
    let background_c =
      "Background Color: " + (map_v(12) < 0.8 ? "Light" : "Dark");

    let facing = "Facing: ";
    if (map_v(14) < 0.1) {
      facing += "You";
    } else if (map_v(13) < 0.5) {
      facing += "West";
    } else {
      facing += "East";
    }

    let haunting = "Haunting: ";
    if (map_v(16) < 0.6) {
      haunting += "Periodic";
    } else if (map_v(16) < 0.7) {
      haunting += "Persistent";
    } else if (map_v(16) < 0.8) {
      haunting += "Poltergeist";
    } else if (map_v(16) <= 1) {
      haunting += "Premonition";
    }

    let backdrop_sync =
      "Backdrop Sync: " + (map_v(18) < 0.15 ? "True" : "False");

    features.push(
      positioning,
      colors,
      stretch,
      haunting,
      facing,
      spook,
      bands,
      brush_style,
      reach,
      altitude,
      backdrop,
      backdrop_style,
      backdrop_sync,
      background_c
    );

    featuresReduced.push(
      positioning,
      colors,
      stretch,
      haunting,
      facing,
      spook,
      bands,
      brush_style,
      reach,
      altitude,
      backdrop,
      backdrop_style,
      backdrop_sync,
      background_c
    );

    function map_v(index, min = 0, max = 1) {
          return rv[index].map(0, 255, min, max);
      }
    //console.log(featuresReduced);
}
else if (projectId === 29){
  // --- INSPIRALS FEATURES ---

  // --- DATA ---
  let _shapeData = [
      // animation values a:[paramNum,min,max,speed]
      {t:1, n:1},
      {t:6, a:[3, 0, 2, 2.5], n:1},
      {t:1, a:[1, 0.26, 1, 0.4], n:1},
      {t:1, a:[3, 0, 1.1], n:1},
      {t:2, a:[1,0,1.6,2], n:1},
      // 5
      {t:2, a:[1, 0 ,2, 2], n:2},
      {t:2, a:[1, 0, 1.5, 2]},
      {t:25, a:[1, 0, 1.6, 2], n:2},
      {t:26, a:[1, 0.116, 0.76], n:1},
      {t:4, a:[1, 0, 0.752], n:1},
      // 10
      {t:4, a:[5, 0, 1.85, 2], n:1},
      {t:6, a:[3, 0, 1.1, 1.6], n:1},
      {t:6, a:[3, 0, 1.8, 2], n:2},
      {t:6, a:[4, 0, 2, 2], n:2},
      {t:6, a:[3,0,1.3,2]},
      // 15
      {t:8, a:[3, 0, 1, 0.8]},
      {t:8, a:[1, 0, 0.7, 1.5]},
      {t:9, a:[1,0.192,2,2], n:1},
      {t:9, a:[1,0.488,1.6], n:1},
      {t:9, a:[2, 0.02, 0.3]},
      // 20
      {t:13, a:[1,0,0.3,0.6]},
      {t:13, a:[1, 0.08, 0.3, 0.4]},
      {t:15, a:[1,0,0.58,2], n:2},
      {t:22, a:[1, 0,0.9]},
      {t:22, a:[1,0,1.12,2], n:2},
      // 25
      {t:25, a:[1,0,1.268,2], n:2},
      {t:2, a:[1,0.612,1.628]},
      {t:6, a:[1,0.128,0.268,0.6]},
      {t:25, a:[1,0,1.72,2], n:2},
      {t:2, a:[1,0,1.52,2], n:2},
      // 30
      {t:6, a:[3,0,0.72,2], n:2},
      {t:6, a:[3,0.44,0.764], n:2},
  ];

  let _paramData = [
      {s:4, p:[0,1.192,0.432,0.096]},
      {s:5, p:[0.132,0.304,0.128,0]},
      {s:6, p:[0.163,0.871,0.039,0.02]},
      {s:6, p:[0.116,1.092,0.092,0.082]},
      {s:7, p:[0.072,0.86,0.032]},

      {s:7, p:[0.044,1.876,0.16]},
      {s:11, p:[0.26,0.52,0.116,0.5,1.7]},
      {s:11, p:[0.244,0.436,0,1.496,0.872], a:[4, 0, 0.884, 2]},
      {s:11, p:[0.232,0,0.144,0.492,0.12], a:[3, 0, 2, 2]},
      {s:28, p:[0.032,1.24,0.084], a:[1,0,1.72,2]},
      // 10
      {s:28, p:[0.004,1.772,0], a:[1,0,2,2]},
      {s:24, p:[0.048,0.012,0.168], a:[1,0,1,2]},
      {s:24, p:[0.048,0.7,0.092], a:[1,0,0.836,2]},
      {s:25, p:[0.064,0.484,0.04], a:[1,0,1.268,2]},
      {s:25, p:[0.008,1.072,0.176]},

      {s:25, p:[0.064,0.46,0.04]},
      {s:25, p:[0.068,0.812,0.004]},
      {s:25, p:[0.04,0.496,0.096]},
      {s:26, p:[0.116,1.204,0,0.268]},
      {s:23, p:[0.02,0.116,0.22], a:[1,0,1.37,2]},
      // 20
      {s:23, p:[0,0.128,0.14]},
      {s:23, p:[0.048,0.6,0.04], a:[1,0,0.78,2]},
      {s:23, p:[0.068,0.016,0.032]},
      {s:11, p:[0.012,0.388,0.212,1.628,0.9], a:[1,0.332,0.748]},
      {s:23, p:[0.108,1.048,0.04], a:[1,0,1.45,2]},

      {s:24, p:[0.06,1.004,0.264]},
      {s:24, p:[0.036,0.188,0.076], a:[1,0,0.656,2]},
      {s:14, p:[0.128,0.332,0,0.648,1.92]},
      {s:21, p:[0.076,0.168,0.56], a:[2,0.36,0.652]},
      {s:5, p:[0.072,0.048,0.248,0.084]},
      // 30
      {s:7, p:[0.084,0.42,0.012]},
      {s:20, p:[0.148,0.068,0.596], a:[0,0.052,0.32,0.6]},
      {s:19, p:[0.008,1.716,0.2], a:[1,0.884,2,1]},
      {s:19, p:[0.187,1.665,0.031], a:[1,0.756,2,1.2]},
      {s:19, p:[0.024,1.916,0.22],a:[1,0.904,2]},

      {s:13, p:[0.104,0.528,0.228,0.772,1.968], a:[4, 0.788, 2, 2]},
      {s:19, p:[0.176,1.948,0.056], a:[1, 0.928, 2, 2]},
      {s:4, p:[0.052,0.052,0.324,0.088]},
      {s:17, p:[0.1,1.368,0.164]},
      {s:22, p:[0.056,0.14,0.056], a:[1,0.092,0.42]},
      // 40
      {s:7, p:[0.072,0.516,0.032]},
      {s:7, p:[0.076,0.34,0.076]},
      {s:7, p:[0.02,0.792,0.196]},
      {s:3, p:[0.124,0.536,0.064,0.276]},// out
      {s:28, p:[0.036,0.312,0.076]},

      {s:11, p:[0.216,0.52,0.048,0.072,0.488], a:[3,0,1.4]},
      {s:13, p:[0.104,0.528,0.228,0.564,1.604]},
      {s:13, p:[0.132,0.104,0.164,0.024,0.9], a:[4, 0, 1, 1.4]},
      {s:13, p:[1.1,1.808,0.252,0.352,1.34], a:[0, 0.172, 1.9, 2.6]},
      {s:13, p:[0.12,0.488,0.22,0.52,1.068]},
      // 50
      {s:12, p:[0.32,0.572,0.032,0.136,1.948], a:[1, 0.34, 1.08]},
      {s:13, p:[0.16,0.484,0.192,1.836,0.044], a:[4, 0, 1.7, 2]},
      {s:12, p:[0.38,0.596,0.012,0.96,0.008]},
      {s:9, p:[0.036,0.576,0.064,0.28,0.412,0.332]},
      {s:12, p:[0.16,0.712,0.368,1.224,0.516], a:[1, 0.4, 2, 2]},

      {s:11, p:[0.192,0.2,0.008,0.276,1.164], a:[1, 0, 0.272, 0.6]},
      {s:4, p:[0,1.524,0.432,0.108]},
      {s:0, p:[0.168,0.926,0.076,0.608], a:[1, 0.2, 1, 0.5]},
      {s:0, p:[0.18,0.588,0.016,0.196]},
      {s:25, p:[0.084,0.492,0.008]},

      // 60
      {s:12, p:[0,0.444,0.32,1.164,1.7],a:[1, 0.34, 1.092,1.2]},
      {s:2, p:[0.024,0.936,0.136,0.768]},
      {s:23, p:[0.048,0.152,0.128], a:[1,0,1.4,2]},
      {s:3, p:[0.088,0.528,0.06,0.208], a:[1, 0.08, 0.564, 0.6]},
      {s:23, p:[0,0.764,0.14]},

      {s:5, p:[0.052,1.448,0,0.492]},// in
      {s:5, p:[0.072,0.016,0.244,0.008]},// in
      {s:5, p:[0.124,1.964,0.044,0.288], a:[3,0,0.8]},// in
      {s:6, p:[0.196,0.084,0.036,0.076]},// in
      {s:6, p:[0.156,0.488,0.05,0.02]},// in
      // 70
      {s:6, p:[0.08,0.632,0.136,0.036]},// in
      {s:29, p:[0,0.524,0.208,0.232]},
      {s:23, p:[0.052,1.084,0.16], a:[1,0,1.4,2]},// in
      {s:8, p:[0.064,0.108]},// out
      {s:9, p:[0.06,0.604,0.016,0.244,0.352,0.124], a:[3, 0, 0.832]},// in

      {s:27, p:[0.072,0.176,0.164,0.548,1.9], a:[4, 0.976, 1.97, 2]},
      {s:9, p:[0.032,0.424,0.248,0.156,0.064,0.516], a:[3, 0.052, 0.424]},// in
      {s:14, p:[0.128,0.336,0.016,0.724,1.92]},
      {s:12, p:[0.048,0.472,0.264,2,1.2],a:[2, 0.116, 0.416]}, // in
      {s:10, p:[0.168,0.22,0.148,0.384,0.064,1.78]},// in
      // 80
      {s:10, p:[0.172,0.176,0.16,0.524,0.304,1.836]},// in
      {s:11, p:[0.26,0.52,0.112,0.196,1.696]},// in
      {s:11, p:[0.064,0.248,0.116,0.56,0.152], a:[1,0,0.264,0.4]},// in
      {s:12, p:[0.36,0.656,0.004,0.896,0.008],a:[3, 0, 1.5, 2]},// in
      {s:12, p:[0.36,0.656,0.004,0.96,0.472],a:[3, 0.332, 1.558, 2.5]},// in

      {s:2, p:[0.328,0.788,0.092,0.508] },// out
      {s:13, p:[0.024,0.472,0.272,0.376,1.712]},
      {s:15, p:[0.052,0.532,0.152,0.108]},
      {s:15, p:[0.164,0.428,0,0.084], a:[3, 0, 0.6, 0.4]},
      {s:16, p:[0.156,0.56,0.116,0.192]},
      // 90
      {s:16, p:[0.308,0.836,0,0.66], a:[1,0.35,1.0]},
      {s:5, p:[0.048,1.316,0,0.42], a:[3, 0.316,0.808, 1.5]},
      {s:22, p:[0.084,0.06,0.08], a:[1,0.025,0.8]},
      {s:18, p:[0.128,0.72,0.056], a:[2,0.012,0.4]},
      {s:18, p:[0.132,1.008,0.124]},

      {s:26, p:[0.208,0.94,0,0], a:[1,0.684,1.9,2.5]}, // new
      {s:27, p:[0.08,0.152,0.164,0.548,1.9], a:[1,0,0.26,0.5]},
      {s:21, p:[0.076,0.208,0.436]},
      {s:22, p:[0.028,0.264,0.232]},
      {s:11, p:[0.152,0.512,0.328,0.508,1.932], a:[3, 0, 2, 1.4]},
      // 100
      {s:27, p:[0.072,0.212,0.176,0.116,0.56]},
      {s:25, p:[0.112,0,0.016], a:[1,0,1.268,2]},
      {s:20, p:[0.164,0.08,0.4]},
      {s:29, p:[0.096,0.856,0.152,0.012], a:[2,0.08,0.66,1.4]},
      {s:30, p:[0.1,0.496,0.136,0.508,1.404]},

      {s:30, p:[0.104,0.472,0.144,0.204,0.188], a:[0,0,0.364,0.6]}, //
      {s:30, p:[0.104,0,0.428,0.372,1.696], a:[3,0,1.72,2.5]}, //
      {s:30, p:[0.104,0,0.428,0.656,1.696], a:[3,0,1.72,2.5]}, //
      {s:30, p:[0.104,0.048,0.236,0.536,1.74], a:[2,0.072,0.816,0.8]}, //
      {s:19, p:[0.108,0.208,0.052]}, //
      // 110
      {s:20, p:[0.064,0.144,0.4], a:[1,0.08,0.4,0.6]},
      {s:1, p:[0.072,0.624,0.396,1.812,1.92]},
      {s:1, p:[0.244,0.7,0.452,2,1.664], a:[3, 0.192, 1.9, 2.5]},
      {s:11, p:[0.24,0.048,0.084,0.133,1.528]},
      {s:11, p:[0.18,0.136,0.148,0.076,1.564]},

      {s:31, p:[0.124,0.524,0.056,0.576,0.908]},
      {s:31, p:[0.12,0.516,0.056,0,1.1], a:[3,0,0.344]},
      {s:31, p:[0.132,0.148,0.056,0.636,1.092], a:[3,0,1.092,2]},
      {s:13, p:[0.068,0.42,0.176,1.8,1.784], a:[3, 0, 1.572, 2]},
      {s:13, p:[0.052,0.372,0.148,0.17,1.184], a:[3, 0, 1.61, 2]},
      // 120
      {s:13, p:[0.036,0.36,0.116,0,1.012], a:[4, 0.8, 1.62]},
      {s:15, p:[0.024,0.472,0.152,0.12], a:[3, 0.02, 0.76]},
  ];

  let _electric = [
      ['#500920','#e40032','#fdbf34'],
      ['#0a1415','#af3886','#bdf217'],
      ['#5a2150','#e29800','#bfffd3'],
      ['#1f352a','#e52fdb','#93ff00'],
      ['#2b168c','#ff007d','#f2f500'],

      ['#1f352a','#1a8afe','#9dff0a'],
      ['#1f352a','#e52fdb','#14f9ff'],
      ['#12000e','#f40701','#ffee6a'],
      ['#3c1d46','#f37b6a','#d1ff00'],
      ['#2c0c58','#ff258b','#ffee52']
  ];

  let _wildSet = [
      ['#041517','#c300e6','#ffd3c5'], // "Grape Jam",
      ['#044248','#CFF4FA','#F53CB5'],
      ['#143336','#fe6452','#b7ffff'], //
      ['#212c0f','#426eff','#ffd87c'], // "Cal Beach"
      ['#0a2a45','#ff00b4','#ffefc0'], // ???
  // 5
      ['#1a3c45','#e87a1d','#d4faff'], // orange, pale blue
      ['#402A48','#D00659','#FFEAF4'],
      ['#3e185e','#8f9700','#ffefde'], // "Titan Arum", '#f0f3ff'
      ['#363e21','#9bb565','#fbffc9'], // "Greengrass"
      ['#641a03','#ea989e','#bdecfc'], // "Sugar Club"
  // 10
      ['#0c2d48','#66d2d6','#fbc740'], // "Antigua",
      ['#51322a','#9eca94','#dbefde'], // "Mint Chocolate",
      ['#051e64','#f22822','#fdfbf5'], // "Patriotique",
      ['#06351b','#0091c1','#ffdcfc'], // "Miami",
      ['#22343c','#f46a6c','#bfffeb'], // "Coral Reef",
  // 15
      ['#162325','#b545a7','#fdde70'], // "Purple Iris"
      ['#0c1613','#396caf','#ffd6f3'], // "Blue Carbuncle",
      ['#581c58','#ff87aa','#ffead9'], // "Plum Soda"
      ['#171031','#cb368a','#ffdcb4'],
      ['#193121','#3dadbb','#eeebfe'],
  // 20
      ['#012873','#EAB349','#F9EAE6'],
      ['#421B52','#DA9650','#F9F0FF'],
      ['#27421B','#E3AA60','#E8FFDC'], // "Copper Cloth",
      ['#2D3954','#6C94F0','#C8F9FA'], // "Night Bloom",
      ['#423116','#E6B363','#FFE5BA'], // "Wheat Field",

      ['#332F1B','#62A8A4','#F5EECE'],
  ];

  let _electricNames = [
      "Flame On",
      "Hulk Mad",
      "Copper Green",
      "Hulk Smash",
      "Candy Shop",
      "Nikko Blue",
      "Turquoise Dream",
      "Red Robin",
      "Tiger Lily",
      "Sugar Club"
  ];

  let _wildNames = [
      "Grape Jam",
      "Fuschia Frost",
      "Salmon Skin",
      "Cal Beach",
      "Cream Candy",

      "Rusty Hull",
      "Vampyre",
      "Titan Arum",
      "Greengrass",
      "Marrakesh",

      "Antigua",
      "Mint Chocolate",
      "Patriotique",
      "Miami",
      "Coral Reef",

      "Purple Iris",
      "Blue Carbuncle",
      "Plum Soda",
      "Berry Tart",
      "Blue Ice",

      "Banana Boat",
      "Late Harvest",
      "Copper Cloth",
      "Night Bloom",
      "Wheatfield",
      "Sea Foam"
  ];

  const _schemes =
  {
      Wild: 11,
      Electric: 14,
      BW: 16,
      Gray: 18,
      Family: 19
  }

  const _schemeNames =
  {
      11: "Wild",
      14: "Electric",
      16: "Black and White",
      18: "Grayscale",
      19: "Family"
  }

  let pNames =
  {
      //_tileType: 0,
      // colors
      _sh: 1,
      _ss: 2,
      _sl: 3,
      _ch: 4,
      _cs: 5,
      _cl: 6,

      // tiling
      _presetIndex: 7,
      _double: 8,
      //_spiralA: 9,
      //_spiralB: 10,

      // shape adjustments
      _adjust1: 11,
      _adjust2: 12,
      _adjust3: 13,
      _adjust4: 14,
      _adjust5: 15,
      _adjust6: 16,

      _colorScheme: 17,
      _lineStyle: 18,
      _sp: 19
  }

  const _lineModes = {
      Dark: 0,
      Midtone: 1,
      Black: 2,
      None: 3,
      White: 4
  }
  var sn;
  var special;
  let spColors = [
      [175, 60, 12, 25],
      [200, 60, 12, 25],
      [220, 60, 12, 25],
      [250, 60, 15, 25],
      [280, 60, 15, 25],
      [320, 60, 15, 25]
  ];
  let spids = {
      111:4,
      420:80,
      666:30,
      999:62
  };
  // --- GLOBALS ---

  let _raw;

  // colors

  let _colorScheme = _schemes.Family;
  let _schemeIndex = 0;
  let _cols = [];
  let _paletteName;
  let _baseColor;
  let _baseColorName;
  let _lineStyle = 0;

  let _startHue;
  let _changeHue;

  // tiling
  let _currentPreset = 0;
  let _presetIdx = 0;
  let _doubleSpiral = false;

  // --- METADATA ---
  function getFeatures(_tokenHash, _tokenId)
  {
      _raw = extractParameters(_tokenHash);
      setParams(_tokenId);
      chooseColorNames();
      return reportFeatures();
  }

  // Produces 32 values between 0 and 255 inclusive
  function extractParameters(hash)
  {
      let _values = [];
      let _substr;
      for (let j = 0; j < 32; j++)
      {
          _substr = hash.substr(2 + (j * 2), 2);
          _values.push(parseInt(_substr, 16));
      }
      return _values;
  }

  function reportFeatures()
  {
      let _feats = [];

      // color scheme
      _feats.push("Color Scheme: " + _schemeNames[_colorScheme]);

      // color palette
      _feats.push("Palette: " + _paletteName);

      // base color
      if (_baseColorName == "")
      {
          _baseColorName = getColorName(_baseColor);
      }
      _feats.push("Base Color: " + _baseColorName);

      // line
      _feats.push("Outline: " + Object.keys(_lineModes)[_lineStyle]);

      // symmetry
      _feats.push("Symmetry Type: " + _currentPreset.sh.t);

      // shape
      _feats.push("Shape: " + (_currentPreset.s + 1));

      // pattern
      _feats.push("Pattern: " + (_presetIdx + 1));

      // spirals
      _feats.push("Spiral: " + (_doubleSpiral ? "Double" : "Single"));

      // can't support this one without the full script
      //_feats.push("Distortions: " + _tiling.numParameters());

      return _feats;
  }

  function getColorName(hue)
  {
      hue = hue % 360;
      let _colorName = "Unknown";
      if (hue > 315)
      {
          _colorName =  "Red";
      }
      else if (hue > 300)
      {
          _colorName =  "Pink";
      }
      else if (hue > 255)
      {
          _colorName =  "Purple";
      }
      else if (hue > 202)
      {
          _colorName =  "Blue";
      }
      else if (hue > 185)
      {
          _colorName =  "Aqua";
      }
      else if (hue > 93)
      {
          _colorName =  "Green";
      }
      else if (hue > 63)
      {
          _colorName =  "Chartreuse";
      }
      else if (hue > 42)
      {
          _colorName =  "Yellow";
      }
      else if (hue > 15)
      {
          _colorName =  "Orange";
      }
      else
      {
          _colorName =  "Red";
      }
      return _colorName;
  }

  function setParams(_tokenId)
  {
      sn = parseInt(_tokenId) % 1000000;
      special = ((sn % 111) === 0 || _raw[pNames._double] > 252);
      //console.log("_raw[pNames._double]=" + _raw[pNames._double]);
      if (special)
      {
          _presetIdx = spids[sn];
          //console.log("SPECIAL");
          if (!_presetIdx) _presetIdx = _raw[pNames._presetIndex] % 20;
          _doubleSpiral = true;
      }
      else
      {
          _presetIdx = _raw[pNames._presetIndex] % _paramData.length;
          _doubleSpiral = false;
      }

      _currentPreset = _paramData[_presetIdx];
      _currentPreset.sh = _shapeData[_currentPreset.s];
  }

  function chooseColorNames()
  {
      let startSat, startLig, blackAndWhite = false;
      _schemeIndex = 0;
      _baseColorName = "";

      if (special)
      {
          if (sn == 666)
          {
              _colorScheme = _schemes.Electric;
          }
          else if (sn == 999)
          {
              _colorScheme = _schemes.BW;
          }
          else
          {
              _colorScheme = _schemes.Family;

              let si = _raw[pNames._sp] % spColors.length;
              let newColors = spColors[si];
              _startHue = newColors[0];
              startSat = newColors[1];
              startLig = newColors[2];
              _changeHue = newColors[3];
          }
      }
      else
      {
          _colorScheme = (_raw[pNames._colorScheme] % 64);
          if (_colorScheme >= _schemes.Family)
          {
              _colorScheme = _schemes.Family;
              _paletteName = "Generated";
          }
          else if (_colorScheme <= _schemes.Wild)
          {
              _colorScheme = _schemes.Wild;
          }
          else if (_colorScheme <= _schemes.Electric)
          {
              _colorScheme = _schemes.Electric;
          }
          else if (_colorScheme <= _schemes.BW)
          {
              _colorScheme = _schemes.BW;
          }
          else if (_colorScheme <= _schemes.Gray)
          {
              _colorScheme = _schemes.Gray;
          }

          _changeHue = map2(_raw[pNames._ch], 0, 255, 5, 30);

          _startHue = map2(_raw[pNames._sh], 0, 255, 0, 360);
          // reduce chartreuse
          if (_startHue > 48 && _startHue < 89)
          {
              _startHue += 279 - (_changeHue * 7);
          }

          startSat = map2(_raw[pNames._ss], 0, 255, 40, 100);
          startLig = map2(_raw[pNames._sl], 0, 255, 0, 24);
      }
      blackAndWhite = (_colorScheme == _schemes.BW);

      let _changeSat = map2(_raw[pNames._cs], 0, 255, 15, 35);
      let _changeLig = map2(_raw[pNames._cl], 0, 255, 31, 43);

      // determine line style
      let _needLine = (_currentPreset.sh.n == undefined) ? 0 : _currentPreset.sh.n;

      _lineStyle = _raw[pNames._lineStyle] % 16;
      if (_lineStyle > 3 || _needLine == 2 || (_lineStyle == 3 && _needLine == 1))
      {
          _lineStyle = 0;
      }
      if (_lineStyle == _lineModes.Dark) _changeLig += 9;

      // consider the middle color the base color
      _baseColor = _startHue + _changeHue;

      _cols = [];
      if (blackAndWhite)
      {
          _paletteName = "Black and White";
          _baseColorName = "Black";
          _lineStyle = _lineModes.White;
      }
      else if (_colorScheme == _schemes.Wild)
      {
          _schemeIndex = (sn == 420) ? 8 : _raw[pNames._ch] % _wildSet.length;
          _paletteName = _wildNames[_schemeIndex];
          _baseColor = setHexColors(_wildSet[_schemeIndex]);
      }
      else if (_colorScheme == _schemes.Electric)
      {
          _schemeIndex = (sn == 666) ? 0 : _raw[pNames._ch] % _electric.length;
          _paletteName = _electricNames[_schemeIndex];
          _baseColor = setHexColors(_electric[_schemeIndex]);
      }
      else if (_colorScheme == _schemes.Gray)
      {
          _paletteName = "Grayscale";
          _baseColorName = "Gray";
      }
      else
      {
          _paletteName = "Generated";
          let lig, sat;
          let minLig = (_baseColor > 60 && _baseColor < 189) ? 98 : 95;
          let maxSat = (_baseColor > 60 && _baseColor < 189) ? 15 : 25;

          for (let i = 0; i < 4; i++)
          {
              lig = startLig + (i * _changeLig);
              sat = startSat + (i * _changeSat)
              if (i >= 2)
              {
                  lig = Math.min(Math.max(lig, minLig), 100);
                  sat = Math.max(sat, maxSat);
              }
              _cols.push(
                  [_startHue + (i * _changeHue),
                  sat,
                  lig]
              )
          }
          //console.log("generated: " + JSON.stringify(_cols));
      }
      //console.log("palette=" + _paletteName);
      //console.log("base=" + _baseColor + ", baseColor=" + getColorName(_baseColor));
  }

  function setHexColors(colArray)
  {
      _cols = [];
      colArray.map((arr) => {
          _cols.push(hsluv.hexToHsluv(arr));
      });
      //console.log("setColors(): " + JSON.stringify(_cols));
      return _cols[1][0];
  }

  // --- UTILITIES ---

  function map2(val, fromLow, fromHigh, toLow, toHigh)
  {
      let fromRange = fromHigh - fromLow;
      let toRange = toHigh - toLow;
      let newVal = (((val - fromLow) / fromRange) * toRange) + toLow;
      return newVal;
  }

  function colHexToHsluv(hexColor)
  {
      // First convert the HSLuv values to a RGB array
      const hsl = hsluv.hexToHsluv(hexColor);
      // Then use the RGB values in a scale of 0-255
      return hsl;
  }

  // --- HSluv ---
  let hsluv;
  (function() {function f(a){var c=[],b=Math.pow(a+16,3)/1560896;b=b>g?b:a/k;for(var d=0;3>d;){var e=d++,h=l[e][0],w=l[e][1];e=l[e][2];for(var x=0;2>x;){var y=x++,z=(632260*e-126452*w)*b+126452*y;c.push({b:(284517*h-94839*e)*b/z,a:((838422*e+769860*w+731718*h)*a*b-769860*y*a)/z})}}return c}function m(a){a=f(a);for(var c=Infinity,b=0;b<a.length;){var d=a[b];++b;c=Math.min(c,Math.abs(d.a)/Math.sqrt(Math.pow(d.b,2)+1))}return c}
  function n(a,c){c=c/360*Math.PI*2;a=f(a);for(var b=Infinity,d=0;d<a.length;){var e=a[d];++d;e=e.a/(Math.sin(c)-e.b*Math.cos(c));0<=e&&(b=Math.min(b,e))}return b}function p(a,c){for(var b=0,d=0,e=a.length;d<e;){var h=d++;b+=a[h]*c[h]}return b}function q(a){return.0031308>=a?12.92*a:1.055*Math.pow(a,.4166666666666667)-.055}function r(a){return.04045<a?Math.pow((a+.055)/1.055,2.4):a/12.92}function t(a){return[q(p(l[0],a)),q(p(l[1],a)),q(p(l[2],a))]}
  function u(a){a=[r(a[0]),r(a[1]),r(a[2])];return[p(v[0],a),p(v[1],a),p(v[2],a)]}function A(a){var c=a[0],b=a[1];a=c+15*b+3*a[2];0!=a?(c=4*c/a,a=9*b/a):a=c=NaN;b=b<=g?b/B*k:116*Math.pow(b/B,.3333333333333333)-16;return 0==b?[0,0,0]:[b,13*b*(c-C),13*b*(a-D)]}function E(a){var c=a[0];if(0==c)return[0,0,0];var b=a[1]/(13*c)+C;a=a[2]/(13*c)+D;c=8>=c?B*c/k:B*Math.pow((c+16)/116,3);b=0-9*c*b/((b-4)*a-b*a);return[b,c,(9*c-15*a*c-a*b)/(3*a)]}
  function F(a){var c=a[0],b=a[1],d=a[2];a=Math.sqrt(b*b+d*d);1E-8>a?b=0:(b=180*Math.atan2(d,b)/Math.PI,0>b&&(b=360+b));return[c,a,b]}function G(a){var c=a[1],b=a[2]/360*2*Math.PI;return[a[0],Math.cos(b)*c,Math.sin(b)*c]}function H(a){var c=a[0],b=a[1];a=a[2];if(99.9999999<a)return[100,0,c];if(1E-8>a)return[0,0,c];b=n(a,c)/100*b;return[a,b,c]}function I(a){var c=a[0],b=a[1];a=a[2];if(99.9999999<c)return[a,0,100];if(1E-8>c)return[a,0,0];var d=n(c,a);return[a,b/d*100,c]}
  function J(a){var c=a[0],b=a[1];a=a[2];if(99.9999999<a)return[100,0,c];if(1E-8>a)return[0,0,c];b=m(a)/100*b;return[a,b,c]}function K(a){var c=a[0],b=a[1];a=a[2];if(99.9999999<c)return[a,0,100];if(1E-8>c)return[a,0,0];var d=m(c);return[a,b/d*100,c]}function L(a){for(var c="#",b=0;3>b;){var d=b++;d=Math.round(255*a[d]);var e=d%16;c+=M.charAt((d-e)/16|0)+M.charAt(e)}return c}
  function N(a){a=a.toLowerCase();for(var c=[],b=0;3>b;){var d=b++;c.push((16*M.indexOf(a.charAt(2*d+1))+M.indexOf(a.charAt(2*d+2)))/255)}return c}function O(a){return t(E(G(a)))}function P(a){return F(A(u(a)))}function Q(a){return O(H(a))}function R(a){return I(P(a))}function S(a){return O(J(a))}function T(a){return K(P(a))}
  var l=[[3.240969941904521,-1.537383177570093,-.498610760293],[-.96924363628087,1.87596750150772,.041555057407175],[.055630079696993,-.20397695888897,1.056971514242878]],v=[[.41239079926595,.35758433938387,.18048078840183],[.21263900587151,.71516867876775,.072192315360733],[.019330818715591,.11919477979462,.95053215224966]],B=1,C=.19783000664283,D=.46831999493879,k=903.2962962,g=.0088564516,M="0123456789abcdef";
  hsluv={hsluvToRgb:Q,rgbToHsluv:R,hpluvToRgb:S,rgbToHpluv:T,hsluvToHex:function(a){return L(Q(a))},hexToHsluv:function(a){return R(N(a))},hpluvToHex:function(a){return L(S(a))},hexToHpluv:function(a){return T(N(a))},lchToHpluv:K,hpluvToLch:J,lchToHsluv:I,hsluvToLch:H,lchToLuv:G,luvToLch:F,xyzToLuv:A,luvToXyz:E,xyzToRgb:t,rgbToXyz:u,lchToRgb:O,rgbToLch:P};})();

  // call it
  features = getFeatures(tokenData, tokenId);
  // features are simple enough, so no need to reduce
  featuresReduced = features;
  //console.log(features);
}

/////////////////

else if (projectId===30){

  var hash = tokenData;

var seed = parseInt(hash.slice(0, 16), 16);
var PALS = [["#000020", "#EEEEEE", "#FFFFFF00"],
["#E2EBFB", "#0F1318", "#000003"],
["#E8175D", "#D8A499", "#000020"],
["#D1ADEF", "#80D9FF", "#000030"],
["#FFAF00", "#FBF0D2", "#614200"],
["#F2D39F", "#2A1F30", "#000003"],
["#E6DDCE", "#70C7DB", "#C0A95B"],
["#C2AFCF", "#1E1028", "#000003"],
["#95CB99", "#D8D9DE", "#000020"],
["#FECB00", "#007CBC", "#000003"],
["#F4F9F9", "#7289DA", "#000030"],
["#949EBB", "#D7DDEA", "#000003"],
["#D8FF14", "#FF1FDA", "#090036"],
["#D9A881", "#1F0F08", "#000003"],
["#B32744", "#ED7672", "#000003"],
["#3AC9CE", "#413BCF", "#000000"],
["#44CCFF", "#FFF1D0", "#343432"]];

var C = rnd_arr(PALS);
var DIM_CNV = Math.min(600, 600);
var ROT = rnd_num() > 0.6;
var DIM_M = ROT ? rnd_num(1.5, 3) : 1;
var DIM = DIM_CNV*DIM_M;
var COUNT = rnd_int(3, 20);
var M = DIM/1000;
var MC = M/(COUNT/5);
var BRD = rnd_int(25, 100)*M;
var SPC = rnd_num() > 0.5 ? rnd_int(40, 100)*MC : 0;
var SIZ = (DIM-(BRD*2)-(SPC*(COUNT-1)))/COUNT;
var SHADOW = rnd_num() > 0.25;
var PARTY_1 = rnd_num() > 0.6;
var PARTY_2 = rnd_num() > 0.6;
var BLND = (rnd_num() > 0.8) & (COUNT < 10);
var SHFT_X = rnd_num(2, 4);
var SHFT_Y = rnd_num(2, 4);

function rnd_dec() {
  seed ^= seed << 13;
  seed ^= seed >> 17;
  seed ^= seed << 5;
  return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
}
function rnd_num(a=0, b=1) {
  return a+(b-a)*rnd_dec();
}
function rnd_int(a=0, b=1) {
  return Math.floor(rnd_num(a, b+1));
}
function rnd_arr(x) {
  return x[Math.floor(rnd_num(0, x.length*0.99))];
}

features = ["Primary: "+C[0],
"Sizing: "+ (COUNT < 10 ? "Large" : "Small"),
"Depth: "+ (SHADOW ? "On" : "Off"),
"Shapes: "+(PARTY_1 ? "Multi" : "Single"),
"Party Mode: "+(PARTY_2 ? "Activated" : "Deactivated"),
"Color Mode: "+(BLND ? "Blended" : "Flat"),
"Canvas: "+(ROT ? "Twisted" : "Classic")]

featuresReduced=features;

console.log(features)
}


/////////

else if (projectId===31){
  function scaleValue(value, from, to) {
      let percent = value / (from[1] - from[0]);
      return to[0] + percent * (to[1] - to[0]);
  }

  function getPalette(value) {
      return value < 0.7 ? "Pleasant" : value < 0.8 ? "Cyndaquil" : value < 0.9 ? "Lotus" : "Kinai";
  }

  function landIsSymmetric(value) {
      return value > 0.8;
  }

  function canhasNightTheme(value) {
      return value > 0.85;
  }

  function skyHasHelicopter(value) {
      return value > 0.9;
  }

  let hashPairs = [];
  for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)));
  }

  const inputsFromHash = {
      SELECTED_PALETTE: [0, 0, 0, 1],
      LAND_IS_SYMMETRIC: [6, 7, 0, 1],
      NIGHT_THEME: [19, 20, 0, 1],
      SKY_NB_CLOUDS: [27, 27, 0, 6],
      SKY_HAS_HELICOPTER: [30, 31, 0, 1],
  };

  const parsedInputsValues = {};

  for (const param in inputsFromHash) {
      let chunck = "";
      const config = inputsFromHash[param];
      for (let i = config[0]; i <= config[1]; i++) {
          chunck += hashPairs[i];
      }

      let maxValue = 2 ** (chunck.length * 4) - 1;
      let chunckValue = parseInt(chunck, 16);
      let value = scaleValue(chunckValue, [0, maxValue], [config[2], config[3]]);
      // console.log(`${param} : ${value}`);
      parsedInputsValues[param] = value;
  }

  let palette = "Palette : " + getPalette(parsedInputsValues.SELECTED_PALETTE);
  let nightTheme = "Has a night theme : " + canhasNightTheme(parsedInputsValues.NIGHT_THEME);
  let isSymmetric = "Is symmetric : " + landIsSymmetric(parsedInputsValues.LAND_IS_SYMMETRIC);
  let nbClouds = "Clouds count : " + Math.ceil(parsedInputsValues.SKY_NB_CLOUDS);
  let hasHelicopter = "Has an helicopter : " + skyHasHelicopter(parsedInputsValues.SKY_HAS_HELICOPTER);

  features.push(
      palette,
      isSymmetric,
      nightTheme,
      nbClouds,
      hasHelicopter,
  );

  featuresReduced.push(
      palette,
      isSymmetric,
      nightTheme,
      nbClouds,
      hasHelicopter,
  );
}

///////////

else if (projectId===32){
  function hashToValues(hash) {
    let v = [];
    for (let e = 0; e < 32; e++) v.push(hash.slice(2 + 2 * e, 4 + 2 * e));
    return v.map((e) => parseInt(e, 16));
  }

  function randomValueForIndex(index) {
    return mapRange(randomValues[index], 0, 255, 0, 1);
  }

  function mapRange(value, inputMin, inputMax, outputMin, outputMax, clamp) {
    if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
      return outputMin;
    } else {
      var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
      if (clamp) {
        if (outputMax < outputMin) {
          if (outVal < outputMax) outVal = outputMax;
          else if (outVal > outputMin) outVal = outputMin;
        } else {
          if (outVal > outputMax) outVal = outputMax;
          else if (outVal < outputMin) outVal = outputMin;
        }
      }
      return outVal;
    }
  }

  let randomValues = hashToValues(tokenData);
  let dual = randomValueForIndex(0) < 0.5;
  let compact = !dual && randomValueForIndex(1) < 0.5;
  let paletteNames = [
    'Synergy',
    'Ice',
    'Radical Softness',
    'Making Peace',
    'Tranquility',
    'Rainbow',
    'Fiery',
    'Chill Out',
    'Blue Steel',
  ];
  let randomPalette = Math.floor(randomValueForIndex(2) * paletteNames.length);

  let style = 'Style: ' + (dual ? 'Dual' : 'Single');
  let density = 'Density: ' + (compact ? 'Compact' : 'Normal');
  let palette = 'Palette: ' + paletteNames[randomPalette];

  features.push(
      style,
      density,
      palette
  );

  featuresReduced.push(
      style,
      density,
      palette
  );
}


////////

else if (projectId===33){
  const minLines = 20;
  const maxLines = 200;
  const minPoints = 10;
  const maxPoints = 500;

  const hashPairs = [];
  for (let j = 0; j < 32; j++) {
    hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
  }

  const decPairs = hashPairs.map((x) => parseInt(x, 16));

  let lineCount = `Line count: ${Math.floor(map_v(0, minLines, maxLines))}`;
  let pointCount = `Point count: ${Math.floor(map_v(1, minPoints, maxPoints))}`;

  let lineStyle = 'Line style: ';
  const styleNum = Math.floor(map_v(2, 1, 4));
  switch (styleNum) {
    case 1:
      lineStyle += 'Loopy'
      break;
    case 2:
      lineStyle += 'Neat loopy'
      break;
    default:
      lineStyle += 'Straight'
  }

  let randomEndpoints = `Random endpoints: ${map_v(3) < 0.2 ? 'True' : 'False'}`;
  let hasBorder = `Border: ${map_v(4) < 0.38 ? 'True' : 'False'}`;
  let isFill = `Filled: ${map_v(5) < 0.15 ? 'True' : 'False'}`;

  let size = 'Size: ';
  const sizeNum = map_v(6, 2.1, 3);
  if (sizeNum < 2.3) {
    size += 'Large';
  } else if (sizeNum > 2.8) {
    size += 'Small';
  } else {
    size += 'Normal';
  }

  let doesMove = 'Moves: ';
  let noiseIncrement = 'Noise increment: ';
  if (map_v(7) < 0.05) {
    doesMove += 'True';
    noiseIncrement += map_v(8, 0.0075, .015);
  } else {
    doesMove += 'False';
    noiseIncrement += "N/A";
  }

  let startpointStyle = 'Start points style: '
  const startpointPercent = map_v(11);
  if (startpointPercent <= 0.2) {
    startpointStyle += 'Use previous endpoint';
  } else if (startpointPercent <= 0.4) {
    startpointStyle += 'Random';
  } else {
    startpointStyle += 'On circle edge';
  }

  let colorScheme = 'Color scheme: '
  const colorSchemePercent = map_v(12);
  if (colorSchemePercent <= 0.35) {
    colorScheme += 'Monochromatic';
  } else if (colorSchemePercent <= 0.5) {
    colorScheme += 'Full spectrum';
  } else {
    colorScheme += 'Grayscale';
  }

  nodeStyle = 'Node style: ';
  if (map_v(13) <= .25 && map_v(14) <= .25) {
    nodeStyle += 'Start point and endpoint';
  } else if (map_v(13) <= .25) {
    nodeStyle += 'Just start point';
  } else if (map_v(14) <= .25) {
    nodeStyle += 'Just endpoint';
  } else {
    nodeStyle += 'Normal';
  }

  startpointNodeStyle = `Start point node: ${getNodeStyle(13)}`;
  endpointNodeStyle = `Endpoint node: ${getNodeStyle(14)}`;

  nodeFill = 'Nodes filled: ';
  nodeRatio = 'Possible node size: ';
  nodeRotationStyle = 'Node rotation: '
  maxNodeRotation = 'Max node rotation: ';
  if (map_v(13) > .25 && map_v(14) > .25) {
    nodeRotationStyle += 'N/A';
    maxNodeRotation += 'N/A';
    nodeFill += 'N/A';
    nodeRatio += 'N/A';
  } else {
    const nodeRotationStyleBool = map_v(15) < .3;
    nodeRotationStyle += nodeRotationStyleBool ? 'True': 'False';
    maxNodeRotationNum = map_v(16, Math.PI, 4 * Math.PI);
    if (nodeRotationStyleBool) {
      if (maxNodeRotationNum > 3 * Math.PI) {
        maxNodeRotation += 'Large';
      } else if (maxNodeRotation < 2 * Math.PI) {
        maxNodeRotation += 'Small';
      } else {
        maxNodeRotation += 'Medium';
      }
    } else {
      maxNodeRotation += 'N/A';
    }
    nodeFill += map_v(17) < 0.5 ? 'True' : 'False';
    nodeRatioNum = map_v(18, 3, 25);
    if (nodeRatioNum < 10) {
      nodeRatio += 'Large';
    } else if (nodeRatioNum > 18) {
      nodeRatio += 'Small';
    } else {
      nodeRatio += 'Medium';
    }
  }

  let noiseMagnitude = 'Noise magnitude: ';
  let noiseResolution = 'Noise resolution: ';
  if (((map_v(13) < .25 || map_v(14) < .25) && map_v(15) < .3) || map_v(7) < 0.05) {
    let noiseMagnitudeNum = map_v(9, 25, 35);
    if (noiseMagnitudeNum < 28) {
      noiseMagnitude += 'High'
    } else if (noiseMagnitudeNum > 32) {
      noiseMagnitude += 'Low'
    } else {
      noiseMagnitude += 'Normal'
    }

    let noiseResolutionNum = map_v(10, 1, 10);
    if (noiseResolutionNum < 4) {
      noiseResolution += 'High'
    } else if (noiseResolutionNum > 7) {
      noiseResolution += 'Low'
    } else {
      noiseResolution += 'Normal'
    }
  } else {
    noiseMagnitude += 'N/A';
    noiseResolution += 'N/A';
  }


  let colorAnimation = 'Color animation: ';
  const colorAnimationPercent = map_v(19);
  if (colorAnimationPercent <= 0.05) {
    colorAnimation += 'Hue shift';
  } else if (colorAnimationPercent <= 0.1) {
    colorAnimation += 'Random';
  } else if (colorAnimationPercent <= 0.15) {
    colorAnimation += 'Rotate';
  } else {
    colorAnimation += 'N/A';
  }


  let colorAnimationSpeed = 'Color animation speed: ';
  if (colorAnimationPercent <= .05) {
    const colorAnimationSpeedPercent = map_v(20, 0.8, 1.2);
    if (colorAnimationSpeedPercent < .9) {
      colorAnimationSpeed += 'Fast';
    } else if (colorAnimationSpeedPercent > 1.1) {
      colorAnimationSpeed += 'Slow';
    } else {
      colorAnimationSpeed += 'Normal';
    }
  } else if (colorAnimationPercent <= .15) {
    const framesBetweenColorChange = Math.floor(map_v(21, 3, 10));
    if (framesBetweenColorChange < 5) {
      colorAnimationSpeed += 'Fast';
    } else if (framesBetweenColorChange < 8) {
      colorAnimationSpeed += 'Normal';
    } else if (framesBetweenColorChange < 10) {
      colorAnimationSpeed += 'Slow';
    } else {
      colorAnimationSpeed += 'Very slow';
    }
  } else {
    colorAnimationSpeed += 'N/A';
  }

  features = [];
  features.push(
      size,
      lineStyle,
      colorScheme,
      doesMove,
      colorAnimation,
      isFill,
      nodeStyle,
      nodeFill,
      nodeRatio,
      nodeRotationStyle,
      startpointNodeStyle,
      endpointNodeStyle,
      lineCount,
      pointCount,
      hasBorder,
      startpointStyle,
      randomEndpoints,
      noiseIncrement,
      noiseMagnitude,
      noiseResolution,
      colorAnimationSpeed,
      maxNodeRotation
  );

  featuresReduced = [];
  featuresReduced.push(
      lineStyle,
      size,
      colorScheme,
      doesMove,
      colorAnimation,
      isFill,
      randomEndpoints,
      hasBorder,
      startpointStyle,
      nodeStyle,
      startpointNodeStyle,
      endpointNodeStyle,
      nodeFill,
      nodeRatio,
      nodeRotationStyle,
  );

  function getNodeStyle(pairPos) {
    const nodeStyleProb = map_v(pairPos);
    if (nodeStyleProb <= 0.05) {
      return 'Circle';
    } else if (nodeStyleProb <= 0.1) {
      return 'Square';
    } else if (nodeStyleProb <= 0.15) {
      return 'Triangle';
    } else if (nodeStyleProb <= 0.2) {
      return 'Cross';
    } else if (nodeStyleProb <= 0.25) {
      return 'Asterisk';
    }
    return 'N/A';
  }

  function map_v(index, min = 0, max = 1) {
      return decPairs[index]/255 * (max - min) + min
  }

}


///////


else if (projectId===34){

  var seed = parseInt(tokenData.slice(50, 66), 16);
let hash = [];
for (let i = 0; i < (tokenData.length - 2) / 2; i++) {
  hash.push(parseInt(tokenData.slice(2 + i * 2, 4 + i * 2), 16));
}


choosePaper();
chooseBrush();
chooseInk();
dipIntoInk();
choosePath();
doSig();
//console.log(features);

function choosePaper() {
  let colorH = getVal(1, 6);
  if (getVal(0, 100) > 95) {
    colorH = 0;
  }
  let paperHue = "White";
  if (colorH == 1) {
    paperHue = "Yellow";
  } else if (colorH == 2) {
    paperHue = "Green";
  } else if (colorH == 3) {
    paperHue = "Cyan";
  } else if (colorH == 4) {
    paperHue = "Blue";
  } else if (colorH == 5) {
    paperHue = "Magenta";
  }
  features.push("Paper Hue: " + paperHue);
  let paperTexture = getVal(1, 6);
  features.push("Paper Texture (1 to 5): " + paperTexture);
}

function chooseBrush() {
  let ringCount = getVal(9, 15);
  features.push("Brush Size (1 to 6): " + (ringCount - 8));
  let bristleDensity = getVal(1, 8);
  features.push("Bristle Density (1 to 7): " + bristleDensity);
}

function chooseInk(){
  var inkDensity = getVal(1, 6);
  features.push("Ink Density (1 to 5): " + inkDensity);
}

function dipIntoInk() {
  let inkLoad = getVal(1, 6);
  features.push("Ink Load (1 to 5): " + inkLoad);
  let v = getVal(1, 6); // not a feature but pops a hash-pairing
}

function choosePath() {
  let rotation = getVal(0, 20);
  features.push("Brushstroke Start: Rotated " + rotation * 18 + " degrees");
  var r = getVal(4, 7);
  let sizeRef;
  if (r == 6) {
    sizeRef = "Small";
  } else if (r == 5) {
    sizeRef = "Medium";
  } else {
      sizeRef = "Large";
  }
  features.push("Brushstroke Size: " + sizeRef);
  let stretchX = getVal(19, 26) / 20;
  let stretchY = getVal(19, 26) / 20;
  let xyStretch;
  if (stretchX == stretchY) {
    xyStretch = "Equal";
  } else {
    xyStretch = "Unequal";
  }
  features.push("X/Y Stretch: " + xyStretch);
  let dirRef = "Clockwise";
  if (getVal(0, 3) == 0) {
    dirRef = "Counterclockwise";
  }
  features.push("Direction: " + dirRef);
}

function doSig() {
  var sigInk = getVal(0, 2);
  let sigRef;
  if (sigInk == 0) {
    sigRef = "Light"
  } else {
    sigRef = "Dark";
  }
  features.push("Signature Style: " + sigRef);
}

function getVal(min, max) {
  max = max - 0.001;
  let x = Math.floor((hash[0] * (max - min)) / 255 + min);
  hash.shift();
  return x;
}

featuresReduced = features;
}


///////

else if (projectId===35){
  var canvasSize = 500;
  function getHashCode(s) {
      var hash = 0,
          c = (typeof s == 'string') ? s.length : 0,
          i = 0;
      while (i < c) {
          hash = ((hash << 5) - hash) + s.charCodeAt(i++);
      }

      return (hash < 0) ? ((hash * -1) + 0xFFFFFFFF) : hash;
  };

  function setFeaturesForAerialView(tokenHash) {
      var maxChildren = 7;
      var spacer = 4;
      var edgeLength = getHashCode(tokenHash) % 20 + 5;
      if(edgeLength % 2 == 0) edgeLength = edgeLength+1;
      var gridSize = edgeLength * edgeLength
      var rSizeWithSpacer = canvasSize / edgeLength;
      var rSize = rSizeWithSpacer - spacer;

      var matrix = new Array(edgeLength);

      for (var i = 0; i <= edgeLength; ++i) {
          matrix[i] = new Array(edgeLength);
      }

      var lightTrailColors = [
          ['#000000', 'Black'],
          ['#00FF00', 'Neon Green'],
          ['#FF00FF', 'Neon Pink'],
          ['#F2EA02', 'Gold'],
      ];

      var colors = [
          ['#9BA1D1', '#BAE2DD', '#D2EACB', '#F6F1C4', 'Sliding'],
          ['#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', 'Pastel'],
          ['#CFD6AD', '#EDE8C6', '#B3C7C5', '#91ADB4', 'Elevating'],
          ['#A08A86', '#97C6B0', '#515C74', '#F4ABA4', 'Think'],
          ['#0B3D6F', '#F25930', '#FABB01', '#FFEA48', 'Summer'],
          ['#2E4770', '#F25930', '#CE5E82', '#ECC6A2', 'Wave'],
          ['#4FAF44', '#F6EB14', '#EF4423', '#2A3492', 'Retro'],
          ['#51404F', '#E38B6A', '#6C7244', '#E7BC8A', 'Rustic'],
          ['#CF4F38', '#DDCBA1', '#659F93', '#DFB859', 'Vintage'],
          ['#7700D7', '#00BD75', '#F5DA7C', '#DD367C', '60s']
      ];

      //var style = ['Roadmap', 'Satellite', 'Hybrid'];
      var style = ['roadmap', 'satellite', 'hybrid', 'terrain', 'astronomical'];

      var fillStat = 0;
      var styleStat = 0;

      var tmpHash = tokenHash + tokenHash;
      var backgroundRule = getHashCode(tmpHash) % 100;
      var quadrantRule = getHashCode(tmpHash+tmpHash+tmpHash) % 100;
      var overrule = getHashCode(tmpHash+tmpHash) % 100;
      var rotationRule = getHashCode(tmpHash+tmpHash+tmpHash+tmpHash) % 100;

      var colorsScheme = getHashCode(tokenHash) % colors.length;
      var backgroundTemplate = '<rect width="100%" height="100%" fill="%COLOR%"/>';
      var bIndex = 0;
      if (backgroundRule < 80) {
          bIndex = 0;
      } else if (backgroundRule < 85) {
          bIndex = 1;
      } else if (backgroundRule < 95) {
          bIndex = 2;
      } else {
          bIndex=3;
      }
      styleStat = styleStat + bIndex;
      backgroundTemplate = backgroundTemplate.replace('%COLOR%', lightTrailColors[bIndex][0])

      var countRectangles = 0;
      for (var id = 0; id < gridSize; id++) {
          //coordinates
          var x = id % edgeLength;
          var y = Math.floor(id / edgeLength);
          var xS = x * rSizeWithSpacer;
          var yS = y * rSizeWithSpacer;

          var overlappedIdThenSkip = (matrix[x][y] == 1);
          if(overlappedIdThenSkip) {
              continue;
          }

          /* quadrant size */
          var maxQuadrantSize = 1;
          if(quadrantRule < 7) {
              quadrantSize = 1;
          } else {
              if (quadrantRule < 50) {
                  maxQuadrantSize = edgeLength / 4 ;
              } else if (quadrantRule < 85) {
                  maxQuadrantSize = edgeLength / 2 ;
              } else if (quadrantRule < 95) {
                  maxQuadrantSize = edgeLength / 4 * 3;
              } else {
                  maxQuadrantSize = edgeLength;
              }
              var increaseSize = getHashCode(tmpHash) % 10;
              var quadrantSize = 1;
              if(increaseSize == 1) {
                  quadrantSize = Math.round(getHashCode(tmpHash+id) % maxQuadrantSize)+1;
              }

              /*check out of bounds - fit */
              var outOfBounds = true;
              while(outOfBounds && quadrantSize > 1) {
                  if(edgeLength < x+quadrantSize || edgeLength < y+quadrantSize) {
                      quadrantSize--;
                  } else {
                      for(var shiftX = 0; shiftX <= quadrantSize; shiftX++) {
                          for(var shiftY = 0; shiftY <= quadrantSize; shiftY++) {
                              overlapped = (matrix[x+shiftX][y+shiftY] == 1);
                              if(overlapped) {
                                  quadrantSize--;
                              } else {
                                  outOfBounds = false;
                              }
                          }
                      }
                  }
              }
          }
          /* rectangles */
          var numberOfRectangles = getHashCode(tmpHash) % 10;
          var modulo;
          if (numberOfRectangles <= 7) {
              modulo = 3;
          } else if (numberOfRectangles > 9 && numberOfRectangles <= 17) {
              modulo = 5;
          } else {
              modulo = maxChildren;
          }

         if (overrule == 1 ||overrule == 42 || overrule == 85 ||  overrule == 99) {
              numberOfRectangles = maxChildren;
              styleStat = 1;
          } else if (overrule == 22 || overrule == 33 || overrule == 44 || overrule == 55 || overrule == 66) {
              numberOfRectangles = 1;
              styleStat = 1;
          } else {
              numberOfRectangles = getHashCode(tmpHash) % modulo;
          }

          var tmpRotation = tmpHash.slice(0, 32);
          var tmpColor = tmpHash.slice(32, 64);
          for (var rectangleIdx = 0; rectangleIdx < numberOfRectangles + 1; rectangleIdx++) {
              countRectangles++;

              if (overrule == 10 || overrule == 11 || overrule == 12 || overrule == 13 || overrule == 14) {
                  styleStat = 1;
              } else if (overrule == 95 || overrule == 96 || overrule == 97 || overrule == 98 || overrule == 99) {
                  styleStat = 1;
              }

              for(var i=0; i < quadrantSize; i++){
                  for(var j=0; j < quadrantSize; j++){
                      matrix[x+i][y+j] = 1;
                  }
              }
              tmpRotation = tmpRotation.slice(1) + tmpRotation.slice(0, 1);
              tmpColor = tmpColor.slice(1) + tmpColor.slice(0, 1);
          }

          tmpHash = tmpHash.slice(1) + tmpHash.slice(0, 1);
      }

      var elevation = Math.ceil(100 / (gridSize * maxChildren + gridSize) * countRectangles);
      if (elevation < 20 || elevation > 80) {
          styleStat++;
      }

      features.push("Style: " + style[styleStat]);
      features.push("Lighttrail: " + lightTrailColors[bIndex][1]);
      features.push("Colorset: " + colors[colorsScheme][4]);
      features.push("Altitude: " + edgeLength);
      features.push("Elevation: " + elevation);

      featuresReduced.push("Style: " + style[styleStat]);
      featuresReduced.push("Lighttrail: " + lightTrailColors[bIndex][1]);
      featuresReduced.push("Colorset: " + colors[colorsScheme][4]);
  }
  setFeaturesForAerialView(tokenData);
}

///////

else if (projectId===36){
  let seed = parseInt(tokenData.slice(0, 16), 16);

function rnd_dec() {
  seed ^= seed << 13;
  seed ^= seed >> 17;
  seed ^= seed << 5;
  return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
}
function rnd_num(a=0, b=1) {
  return a+(b-a)*rnd_dec();
}
function rnd_int(a=0, b=1) {
  return Math.floor(rnd_num(a, b+1));
}
function rnd_arr(x) {
  return x[Math.floor(rnd_num(0, x.length*0.99))];
}

var DIM = Math.min(2400, 2400);
var M = DIM/1000;
var IG = 20*M;
var MV_Y = 35*M;
var SZ_X = 295*M;
var MV_X = 30*M;
var STRK_CAP = rnd_int();
var HEADR_CRV = rnd_num(0, 20);
var NUM1 = rnd_int(0, 9);
var NUM2 = rnd_num() > 0.05 ? rnd_int(1, 9) : 0;
var C_R = rnd_int(0, 15);
var SHAPES_R = rnd_int(0, 4);
var MULTI_COL = rnd_num() > 0.5;
var HEAD_R = rnd_num() > 0.5;
var MNMX = [[3,3],[1,2],[2,2],[1,3],[1,3],[1,3],[1,3],[1,1]];
var MNMX_R = rnd_arr(MNMX);
var ALGN_R = rnd_int(0, 3);

features = [
"Edition: "+(NUM2 == 0 ? "Single Digits":"Double Digits"),
"Palette: "+ (C_R+10),
"Shape Set: "+["Cards", "Chess", "Animals", "Symbols", "Letters"][SHAPES_R],
"Column Type: "+(MULTI_COL ? "Multi":"Single"),
"Header Align: "+(HEAD_R ? "Right":"Left"),
"Paragraph Type: "+["Indent", "Left Align", "Center Align", "Right Align"][ALGN_R]
]

featuresReduced=features;

console.log(features)
}

///////


else if (projectId===37){


  let seed = generateSeedFromTokenData(tokenData);

  const rng = rnd;

  const angle = 'Angle: ' + w_pick(['Tilted left', 'Tilted right', 'Rotated left', 'Rotated right', 'Straight'], [16, 8, 4, 2, 1]);
  const type = 'Type: ' + w_pick(['Trooper', 'Convoy', 'Carrier', 'Cruiser', 'Mothership', 'Swarm'], [60, 15, 15, 6, 3, 1]);

  const palette = 'Palette: ' + get_palette();
  const color_mode = 'Coloring strategy: ' + w_pick(['Random', 'Group', 'Main', 'Single'], [4, 16, 4, 1]);

  const base = 'Base color: ' + w_pick(['Black', 'White'], [1, 4]);
  const coordination = 'Coordination: ' + w_pick(['Good', 'Bad'], type == 'Type: Trooper' || type === 'Type: Swarm' ? [1, 9] : [9, 1]);
  const unit_shape = 'Unit shape: ' + w_pick(['Satelite', 'Ship'], [1, 19]);
  const block_shape = 'Block shape:' + w_pick([0.2, 0.5, 0.75], [1, 4, 1]);

  const trooper_rx = 'Width: ' + pick([12, 14, 16]);
  const trooper_ry = 'Height: ' + pick([16, 18, 20, 22]);
  const bulldozer_crew = 'Crew size: ' + pick([2, 3, 4]);
  const zoomer_crew = 'Crew size: ' + pick([2, 3]);

  features.push(type);
  features.push(palette);
  features.push(color_mode);
  features.push(base);
  features.push(angle);

  if (type !== 'Type: Mothership') features.push(coordination);
  features.push(unit_shape);

  if (type === 'Type: Trooper') {
    features.push(trooper_rx);
    features.push(trooper_ry);
  }

  if (type === 'Type: Carrier') features.push(bulldozer_crew);
  if (type === 'Type: Cruiser') features.push(zoomer_crew);

  featuresReduced=features;
  console.log(features);

  // -----

  function rnd() {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;

    const n = ((seed < 0 ? ~seed + 1 : seed) % 100000) / 100000;
    return n === 0 || n === 1 ? 0.5 : n;
  }

  function range(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    return rng() * (max - min) + min;
  }

  function rangeFloor(min, max) {
    return Math.floor(range(min, max));
  }

  function pick(array) {
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }

  function w_pick(arr, warr) {
    const agg = warr.reduce((a, c) => [...a, a[a.length - 1] + c], [0]);
    const t = range(agg[agg.length - 1]);
    const i = agg.findIndex((el) => el > t) - 1;
    return arr[i];
  }

  function generateSeedFromTokenData(tokenData) {
    return parseInt(tokenData.slice(0, 16), 16);
  }

  function get_palette() {
    const palettes = [
      ['Verena', 1],
      ['Revolucion', 1],
      ['Mysore', 2],
      ['Gold Rush', 2],
      ['Magic Hour', 2],
      ['Woodwork', 2],
      ['Ducci', 2],
      ['Docks', 1],
      ['Mono', 1],
      ['Tropico', 2],
      ['Hotspot', 3],
      ['Main Course', 1],
      ['Delphi', 3],
      ['Nowak', 2],
      ['Jupiter', 2],
      ['Spider King', 1],
      ['Giftcard', 1],
      ['Slapdash', 2],
      ['Nightlife', 3],
      ['Paddle', 3],
      ['Dayspring', 3],
      ['Eventide', 3],
      ['Overgrown', 2],
      ['Winegum', 2],
      ['Junkyard', 3],
    ];

    return w_pick(
      palettes.map((a) => a[0]),
      palettes.map((a) => a[1])
    );
  }

}

///////


// SNIP FROM HERE
else if (projectId===38){

    let hash = tokenData
    let seeds = null
    let hashChunks = null
    let playing = null
    let sound = null

    let o = getMetadata(tokenData)

    features.push(`Tint: ${o.tint}`)
    features.push(`Visual: ${o.visual}`)
    features.push(`Family: ${o.family}`)
    features.push(`Sample Rate: ${o.sample_rate}`)
    features.push(`Progressions: ${o.progressions}`)
    //features.push(`Code: ${o.code}`)

    featuresReduced.push(`Tint: ${o.tint}`)
    featuresReduced.push(`Visual: ${o.visual}`)
    featuresReduced.push(`Family: ${o.family}`)
    featuresReduced.push(`Sample Rate: ${o.sample_rate}`)
    featuresReduced.push(`Progressions: ${o.progressions}`)




    //console.log('FEATURES',JSON.stringify(features))

    // CODE
    ///////////////
    // Pseudorandom functions

    // This should be called whenever re-deriving the parameters from the hash.
    // For example, when calling generateParameters in getMetadata
    function resetSeeds(){
        // Pseudorandom chunks from the seed
        hashChunks = hash.match(/../g)
        hashChunks.shift() // pop off the '0x'
        seeds = hashChunks.map(h=>parseInt(h,16))
    }

    // Return a number 0 to 1 based on the next seed in the hash
    function notRandom(){
        //console.log(seeds.length)
        return seeds.length > 0 ? seeds.pop()/256 : 0
    }

    // Return one item from the list, pseudorandomly
    function choose(list){
        return list[Math.floor(notRandom()*list.length)]
    }

    // reset the seeds pointer, re-derive parameters from the hash
    function generateParameters(hash){
        resetSeeds()
        let hue = parseFloat(notRandom())
        //console.log("hue",hue)
        let visual = choose(["bytes","bytes","bits","waveform","starry"]); // make bytes a bit more likely since it has the widest range of patterns
        // Choose based on the relative weight of each family
        let family = choose(
            Array(8).fill("melodic").concat(
            Array(6).fill("heavy")).concat(
            Array(3).fill("wobbly")).concat(
            Array(3).fill("powerclimb")).concat(
            Array(3).fill("absurdities")).concat(
            Array(3).fill("permutations")).concat(
            Array(0).fill("crazy3"))
        )
        // pitch number (use this to derive sample rate and theoretically the root note)
        let pitch_number = Math.ceil(notRandom()*12)
        // sample rate
        let sr = Math.round(Math.pow(2,(pitch_number+-6)/12)*3951.07)
        // generate the bytebeat
        //console.log(family)
        let bb = bytebeatFamilyFunction(family)()

        // melodic and heavy melodic have chord progressions
        let matches = bb.match(/\,c\=b\%(\d)/)
        let progressions = (matches && matches.length>=2) ? parseInt(matches[1]) : 0
        // Let's just say powerclimb has infinity progression
        if(family=="powerclimb"){
            progressions = "Infinity";//"∞"
        }

        var bytebeat = new_bytebeat(bb,sr)

        return {
            "hue": hue,
            "visual": visual,
            "family": family,
            "bytebeat": bytebeat,
            "sr": sr,
            "progressions": progressions,
            "pitch_number": pitch_number
        }
    }

    // getMetadata resets the seeds pointer, re-derives the same parameters,
    // then returns nice human-readable parameters to be shown on artblocks website
    function getMetadata(hash){
        let parameters = generateParameters(hash)

        // Hue > Tint
        let hue = parseInt(parameters["hue"] * 360)
        let tint = hue < 36 ? 'Fire' : ''
        tint = hue >= 36 && hue <= 63 ? 'Goldenrod' : tint
        tint = hue >= 64 && hue <= 133 ? 'Electric' : tint
        tint = hue === 73 ? 'Emerald Dragon' : tint
        tint = hue >= 134 && hue <= 171 ? 'Froggy' : tint
        tint = hue >= 172 && hue <= 181 ? 'Turquoise' : tint
        tint = hue >= 182 && hue <= 191 ? 'Sky' : tint
        tint = hue >= 192 && hue <= 211 ? 'Cobalt' : tint
        tint = hue >= 212 && hue <= 255 ? 'Royal' : tint
        tint = hue >= 256 && hue <= 281 ? 'Regal' : tint
        tint = hue >= 282 && hue <= 323 ? 'Neon' : tint
        tint = hue >= 324 && hue <= 333 ? 'Sexbomb' : tint
        tint = hue > 333 ? 'Lipstick' : tint

        //console.log("hue", hue ,"tint", tint)

        // Visual Type
        let visual = capitalize(parameters["visual"])
        // Bytebeat code template
        let family = capitalize(parameters["family"]).replace("_"," ")
        // update the names
        if(family=="Absurdities"){
            family="Inconsistent Absurdities"
        }else if(family=="Permutations"){
            family="Permutations"
        }else if(family=="Crazy3"){
            family="####"
        }else if(family=="Heavy"){
            family="Heavy Melodic"
        }else if(family=="Melodic"){
            family="Melodic"
        }else if(family=="Powerclimb"){
            family="Powerclimb"
        }else if(family=="Wobbly"){
            family="Wobbly"
        }
        // Sample rate
        let sr = parameters["sr"]
        // Progressions
        let progressions = parameters["progressions"]
        // Note Name
        // This is false actually
        //let note = ["F","F#","G","G#","A","A#","B","C","C#","D","D#","E","F"][parameters["pitch_number"]]

        let code = parameters["bytebeat"]["code"]
        let o = {
            tint: tint,
            visual: visual,
            family: family,
            sample_rate: sr,
            progressions: progressions,
            code: code
        }

        //console.table(o)
        return o
    }


    function capitalize(s){
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function make_sample_function(bytebeat_code){
        //eval("var f = function(t){ return "+bytebeat_code+"; }" )
        try {
            var f = new Function('"use strict"; return function(t){ \
                var a=0,b=0,c=0,d=0,e=0;\
                return '+bytebeat_code+';};')
            return f()
        }catch(e){
            console.error("FAILED FUNCTION")
            return
        }
    }

    /////////////
    // BYTEBEAT GENERATING FUNCTIONS
    /////////

    // returns the function responsible for generating the bytebeat in that family
    function bytebeatFamilyFunction(family){
        switch (family) {
            case "melodic":
                return make_melodic
            case "heavy":
                return make_heavy
            case "absurdities":
                return make_absurdities
            case "permutations":
                return make_permutations
            case "crazy3":
                return make_crazy3
            case "wobbly":
                return make_wobbly
            case "powerclimb":
                return make_powerclimb
        }
    }

    function make_melodic(){
        let r0 = choose([4,5,6,7,8,9])
        let r1 = choose([18,18,18,17,17,17,15,14])
        let r2 = choose(["c=b%2+1","c=b%3+1","c=b%3+1","c=b%4+1","c=b%5+1","c=b%6+1","c=b%24+1"])
        let r3 = choose([7,6,5,4])
        let r4 = choose([4,3,3,3,3,3,2])
        let r5 = choose([
            "(t*(a/2)/c&t>>10)|(t*a/c&t>>9)",
            "(t*(a/2)/c&t>>10)|(t*a/c&t>>9)"
            ])
        let r6 = choose([
            "|(t*(a*4/c)&t>>8)|(t*(a*5/c)&t>>"+r3+")|(t*(a*6/c)&t>>"+r4+")",
            "|(t*(a*4/c)&t>>8)|(t*(a*5/c)&t>>"+r3+")|(t*(a*6/c)&t>>"+r4+")",
            "|(t*(a*2/c)&t>>8)|(t*(a*3/c)&t>>"+r3+")|(t*(a*4/c)&t>>"+r4+")",
            "|(t*(a*5/c)&t>>8)|(t*(a*6/c)&t>>"+r3+")|(t*(a*7/c)&t>>"+r4+")"])
        bb  = "a="+r0+","
        bb += "b=((t>>"+r1+")&0xFF),"
        bb += r2+","
        bb += r5
        bb += r6
        return bb
    }

    // lots of notes, carnival
    function make_absurdities(){
        let r0 = choose([5,6,7,8,9,10,11,12,13])
        let r1 = choose([5,6,7,8,9,10,11,12,13])
        let r2 = choose([5,6,7,8,9,10,11,12,13])
        let r3 = choose([5,6,7,8,9,10,11,12,13])
        let r4 = choose([69,9,4,5,6])
        let bb = "t*(0x"+r4+"+(0xABCDEF&t>>10))*(("+r0+"&t>>"+r1+")|("+r1+"&t>>"+r2+")|("+r2+"&t>>"+r3+")|("+r3+"&t>>"+r0+"))"
        return bb
    }

    // pretty crazy, kind of annoying
    function make_permutations(){
        let r0 = choose([1,2])
        let r1 = choose([1,2,10,20,40,50])
        let bb = "a=0.5,b="+r0+",c="+r1+",(t/a*((-c*(t/a|t/a*b>>5)/4)>>7))"
        return bb
    }

    function make_crazy3(){
        let r0 = choose([1,2,3,4,5,6,7,8,12,24])
        let r1 = choose([1,2,3])
        let r2 = choose(["(c/8<<8)|(c/4<<4)|(c/2<<3)","(c/6<<8)|(c/5<<7)|(c/4<<4)"])
        let bb = "a="+r0+",b=a/"+r1+",t=t*a,c=(-(t>>b|t>>10)>>4)/4,t*("+r2+")"
        return bb
    }

    function make_powerclimb(){
        let r0 = choose([1.6,1.7,1.8])
        let r1 = choose([0.05,0.08,0.1,0.15,0.18,0.2])
        let r2= choose([0,1])
        let bb ="a=0xFF,b="+r0+",c="+r1+",\
    ((1*(pow(t,b+c*0))>>14)&a)^\
    ((1*(pow(t,b+c*1))>>14)&a)^\
    ((1*(pow(t,b+c*2))>>14)&a)^\
    ((1*(pow(t,b+c*3))>>14)&a*"+r2+")"
        return bb
    }

    function make_heavy(){
        let r1 = choose([17,17,16,16,15,14])
        let r2 = choose(["c=b%2+1","c=b%3+1","c=b%3+2","c=b%3+3","c=b%3+4","c=b%4+1","c=b%6+1"])
        let r3 = choose([1,2,3,4,5,6,7,8,9,11])
        let r4 = choose([1,2,3])
        let r5 = choose([8,9])
        let bb ="b=((t>>("+r1+"))&0xFF),"+r2+",((t>>7)|(t>>"+r5+")|(t*"+r3+"))*(t/c<<"+r4+")"
        return bb
    }

    function make_wobbly(){
        let r1 = choose([2,3,4,5])
        let r2 = choose([1,8,16,32,42,64,69,99])
        let bb ="a="+r1+",f="+r2+",b=(((t>>14)&0xFE)+1+f)%0xFE,d=1/4,((t*a*b*(t*a>>(t*a*d>>10)%16)))"
        return bb
    }

    function new_bytebeat(code, sr){
        let original_code = code
        code = replace_all(code, "pow","Math.pow")
        code = replace_all(code, "sqrt","Math.sqrt")
        f = make_sample_function(code)
        return {
            f: f,
            sr: sr,
            code: code,
            original_code: original_code
        }
    }

    ///////
    // HELPER FUNCTIONS
    ////

    // replace all instances of search with replace in string
    function replace_all(string, search, replace) {
        return string.split(search).join(replace)
    }

    // convert hsv to rgb color
    function hsvToRgb(h, s, v) {
    var r, g, b
    var i = Math.floor(h * 6)
    var f = h * 6 - i
    var p = v * (1 - s)
    var q = v * (1 - f * s)
    var t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break
        case 1: r = q, g = v, b = p; break
        case 2: r = p, g = v, b = t; break
        case 3: r = p, g = q, b = v; break
        case 4: r = t, g = p, b = v; break
        case 5: r = v, g = p, b = q; break
    }
    return [ r * 255, g * 255, b * 255 ]
    }

    function samplePos2graph(i, w, h){
        return ( w*(i%h)+Math.floor(i/h) )
    }

    function graphPos2sample(pos, h){
        return pos.x*h+pos.y
    }


}

/////////


if (projectId===39){
  let seed = generateSeedFromTokenData(tokenData);

  function rnd() {

      seed ^= seed << 13;

      seed ^= seed >> 17;

      seed ^= seed << 5;

      return (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000;
  }

  function generateSeedFromTokenData(tokenData) {
      return parseInt(tokenData.slice(0, 16), 16);
  }


  let xp = rnd();
  let xp1 = rnd();

  if(xp1>=0.95){
      features.push('Background: Dark');
  } else {
      features.push('Background: Light');
  }

  if(xp>0.45){
      features.push('Origin: Center');
  } else if(xp<=0.15){
      features.push('Origin: Right');
  } else if(xp>0.15 && xp<=0.3){
      features.push('Origin: Bottom');
  } else if(xp>0.3 && xp<=0.45){
      features.push('Origin: Left');
  }


  if(xp<=0.2){
      features.push('Orientation: The Mirror');
  } else if(xp>0.2 && xp<=0.4){
      features.push('Orientation: ‘The Skewed Mirror');
  } else if(xp>0.4&& xp<=0.6){
      features.push('Orientation: The Reflection');
  } else if(xp>0.6 && xp<0.7){
      features.push('Orientation: The Spread')

  } else {
      features.push('Orientation: Free')
  }
  console.log(features);


  featuresReduced = features;
	}

  ////////

  if (projectId===40){

  	let seed = parseInt(tokenData.slice(0, 16));

  	function rnd() {

  		seed ^= seed << 13;

  		seed ^= seed >> 17;

  		seed ^= seed << 5;

  		return (((seed < 0) ? ~seed + 1 : seed) % 1000);
  	}

  	Number.prototype.map = function (max_arr_index) {
  		return Math.round(this * max_arr_index / 999);
  	}


  	const colors = [
  		'Amethyst',
  		'Cavansite',
  		'Turquoise',
  		'Lemon',
  		'Orange',
  		'Bubble gum',
  		'Strawberry',
  		'Tanzanite',
  		'Hematite',
  		'Silver'
  	];


  	const bases = [
  		{
  			feature: 'Headphones: Circumaural',
  			name: 'b-01a',
  			bodies: ['bd-01','bd-02','bd-03','bd-04','bd-05'],
  			ears: null,
  			markings: ['m-02','m-03','m-04','m-05','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Headphones: Supra-aural',
  			name: 'b-01b',
  			bodies: ['bd-01','bd-02','bd-03','bd-04','bd-05'],
  			ears: null,
  			markings: ['m-02','m-03','m-04','m-05','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Headphones: Earbuds',
  			name: 'b-01c',
  			bodies: ['bd-01','bd-02','bd-03','bd-04','bd-05'],
  			ears: null,
  			markings: ['m-02','m-03','m-04','m-05','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Bodywork: Ducts',
  			name: 'b-02',
  			bodies: null,
  			ears: null,
  			markings: ['m-01','m-02','m-03','m-04','m-05','m-06','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Bodywork: Bun',
  			name: 'b-03',
  			bodies: null,
  			ears: ['e-01','e-02','e-03'],
  			markings: null,
  			faces: ['f-01-b','f-02-b','f-03-b','f-04-b','f-06-b','f-07-b'],
  		},
  		{
  			feature: 'Bodywork: Capsule',
  			name: 'b-04',
  			bodies: null,
  			ears: ['e-05','e-06'],
  			markings: ['m-01','m-02','m-03','m-04','m-05','m-06','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Bodywork: Bug',
  			name: 'b-05',
  			bodies: null,
  			ears: ['e-05','e-06'],
  			markings: ['m-01','m-02','m-03','m-04','m-05','m-06','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		},
  		{
  			feature: 'Bodywork: Round Top',
  			name: 'b-06',
  			bodies: null,
  			ears: ['e-06'],
  			markings: ['m-01','m-02','m-03','m-04','m-05','m-06','m-07','m-08','m-09'],
  			faces: ['f-01-t','f-02-t','f-03-t','f-04-t','f-05-t','f-06-t','f-07-t'],
  		}
  	]


  	const bodies = [
  		{
  			feature: 'Bodywork: Wedge',
  			name: 'bd-01',
  		},
  		{
  			feature: 'Bodywork: Tentacles',
  			name: 'bd-02',
  		},
  		{
  			feature: 'Bodywork: Jelly',
  			name: 'bd-03',
  		},
  		{
  			feature: 'Bodywork: Block',
  			name: 'bd-04',
  		},
  		{
  			feature: 'Bodywork: Orb',
  			name: 'bd-05',
  		},
  	]

  	const ears = [
  		{
  			feature: 'Antenna: Propeller',
  			name: 'e-01',
  		},
  		{
  			feature: 'Antenna: Magnets',
  			name: 'e-02',
  		},
  		{
  			feature: 'Antenna: Telekinesis',
  			name: 'e-03',
  		},
  		{
  			feature: 'Antenna: Sensors',
  			name: 'e-05',
  		},
  		{
  			feature: 'Antenna: Transceivers',
  			name: 'e-06',
  		},
  	]

  	const markings = [
  		{
  			feature: 'Component: Staples',
  			name: 'm-01',
  		},
  		{
  			feature: 'Component: Flora',
  			name: 'm-02',
  		},
  		{
  			feature: 'Component: X',
  			name: 'm-03',
  		},
  		{
  			feature: 'Component: Gemstone',
  			name: 'm-04',
  		},
  		{
  			feature: 'Component: Window',
  			name: 'm-05',
  		},
  		{
  			feature: 'Component: Armour',
  			name: 'm-06',
  		},
  		{
  			feature: 'Component: Power Button',
  			name: 'm-07',
  		},
  		{
  			feature: 'Component: Sliders',
  			name: 'm-08',
  		},
  		{
  			feature: 'Component: LEDs',
  			name: 'm-09',
  		},
  	];

  	const faces = [
  		{
  			feature: 'State: Idle',
  			name: 'f-01-b',
  		},
  		{
  			feature: 'State: Idle',
  			name: 'f-01-t',
  		},
  		{
  			feature: 'State: Calculating',
  			name: 'f-02-b',
  		},
  		{
  			feature: 'State: Calculating',
  			name: 'f-02-t',
  		},
  		{
  			feature: 'State: Hibernate',
  			name: 'f-03-b',
  		},
  		{
  			feature: 'State: Hibernate',
  			name: 'f-03-t',
  		},
  		{
  			feature: 'State: Startup',
  			name: 'f-04-b',
  		},
  		{
  			feature: 'State: Startup',
  			name: 'f-04-t',
  		},
  		{
  			feature: 'State: Error',
  			name: 'f-05-t',
  		},
  		{
  			feature: 'State: Rec',
  			name: 'f-06-b',
  		},
  		{
  			feature: 'State: Rec',
  			name: 'f-06-t',
  		},
  		{
  			feature: 'State: Searching',
  			name: 'f-07-b',
  		},
  		{
  			feature: 'State: Searching',
  			name: 'f-07-t',
  		},
  	];

  	const chosenColor = colors[rnd().map(colors.length - 1)]

  	features = [];

  	features.push('Colour: '+ chosenColor)

  	const chosenBase = bases[rnd().map(bases.length - 1)]
  	features.push(chosenBase.feature)

  	let chosenBody = null;
  	if(chosenBase.bodies){
  		const possibleBodies = bodies.filter((body)=>chosenBase.bodies.includes(body.name))
  		chosenBody = possibleBodies[rnd().map(possibleBodies.length - 1)]
  		features.push(chosenBody.feature)
  	}

  	if(chosenBase.ears){
  		const possibleEars = ears.filter((ear)=>chosenBase.ears.includes(ear.name))
  		const chosenEar = possibleEars[rnd().map(possibleEars.length - 1)]
  		features.push(chosenEar.feature)
  	}

  	if(chosenBase.markings && (!chosenBody || chosenBody.name !== 'bd-02')){
  		const possibleMarkings = markings.filter((marking)=>chosenBase.markings.includes(marking.name))
  		const chosenMarking = possibleMarkings[rnd().map(possibleMarkings.length - 1)]
  		features.push(chosenMarking.feature)
  	}

  	if(chosenBase.faces){
  		const possibleFaces = faces.filter((face)=>chosenBase.faces.includes(face.name))
  		const chosenFace = possibleFaces[rnd().map(possibleFaces.length - 1)]
  		features.push(chosenFace.feature)
  	}

    featuresReduced=features;


  }

  /////////

  else if (projectId ===41 ){
    // START Comment this out before minifying
    //function random_hash() {
    //    let chars = "0123456789abcdef";
    //    let result = '0x';
    //    for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    //    return result;
    //}
    //tokenData = {
    //    "hash": random_hash()
    //}
    // END Comment this out before minifying

    // let tokenData = {"hash":"0x0c5bc96cf2b1cba8bab689f8caff9482c3402874d039b8987a102b94bcfaef3d","tokenId":"41000004"}
    //let tokenData = {"hash":"0x0559aa28f62cfa991ec451e02360c4e747a95079f9b6ce35f764dc4aac4fca39","tokenId":"41000012"}
    //let tokenData = {"hash":"0x146264f13c1e71c240d15018704c00bb29219b46d22e99d6e2a4c3bf347b18e0","tokenId":"41000575"}

    let hashPairs = [];
    for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + j * 2, 4 + j * 2));
    }

    const decPairs = hashPairs.map((x) => {
        return parseInt(x, 16);
    });

    let seed = parseInt(tokenData.slice(0, 16), 16);

    let gridLoops1 = [];
    let gridLoops2 = [];
    let gridLoops_stroke = [];

    let unit, unit2, unit3, count, count2, count3;
    let offset, offsetH, offsetB, offsetHB, styleMaster, countX, countX2, strokeThick;
    let rectY = true;
    let ellipseY = false;
    let tri1Y = false;
    let tri2Y = false;
    let gradY = false;
    let space1Y = false;
    let space2Y = false;
    let smlRect = false;
    let smlEllipse = false;
    let rectGradY = false;
    const Y_AXIS = 1;
    const X_AXIS = 2;
    let b1, b2, c1, c2;
    let myColRnd1, myColRnd2, myColRnd3, palSwitch;

    var palette;

    // let features = [];
    let parallelCount = [];
    let parallelColour = [];
    let strokeColour = [];
    let dotCount = [];
    let headingCount = [];

    if (decPairs[1] <= 85) {
        features.push("Offset: Goldilocks")
    } else if (decPairs[1] > 85 && decPairs[1] <= 170) {
        features.push("Offset: Biggie")
    } else {
        features.push("Offset: Smalls")
    }

    if (decPairs[2] <= 85) {
        countX = 0;
        features.push("Base: None")
    } else if (decPairs[2] > 85 && decPairs[2] < 170) {
        countX = 1;
        features.push("Base: Single")
    } else {
        countX = 2;
        features.push("Base: Double")
    }

    if (decPairs[3] <= 85) {
        countX2 = 0;
    } else {
        countX2 = 1;
    }

    unit = Math.floor(map_range(decPairs[4], 0, 255, 2, 6));
    unit2 = Math.floor(map_range(decPairs[5], 0, 255, 3, 6));
    unit3 = Math.floor(map_range(decPairs[6], 0, 255, 2, 7));

    if (decPairs[2] > 85) {

        features.push("Base Grid: " + unit + "x" + unit)
    }

    features.push("Top Grid: " + unit2 + "x" + unit2)

    palSwitch = map_range(decPairs[10], 0, 255, 0, 1);

    if (palSwitch <= 0.5) {
        features.push("Palette: Mid-century")
    } else {
        features.push("Palette: Candy")
    }

    class Random {
        constructor(seed) {
            this.seed = seed
        }
        random_dec() {
            this.seed ^= this.seed << 13
            this.seed ^= this.seed >> 17
            this.seed ^= this.seed << 5
            return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
        }
        random_between(a, b) {
            return a + (b - a) * this.random_dec()
        }
        random_int(a, b) {
            return Math.floor(this.random_between(a, b + 1))
        }
        random_choice(x) {
            return x[Math.floor(this.random_between(0, x.length * 0.99))]
        }
    }

    let R = new Random(seed);


    console.log(R);

    class GridLooper {
        constructor(k, l, c, rnd1, rnd2) {
            this.k = k;
            this.l = l;
            this.c = c;
            this.rnd1 = rnd1;
            this.rnd2 = rnd2;
        }

        display() {

            for (let i = 0; i < this.k; i++) {
                for (let j = 0; j < this.l; j++) {

                    styleMaster = Math.floor(R.random_between(0, 9));

                    if (styleMaster == 0) {
                        rectY = true;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 1) {
                        rectY = false;
                        ellipseY = true;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 2) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = true;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 3) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = true;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 4) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = true;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 5) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = true;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 6) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = true;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 7) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = true;
                        smlEllipse = false;
                        rectGradY = false;
                    } else if (styleMaster == 8) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = true;
                        rectGradY = false;
                    } else if (styleMaster == 9) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        gradY = false;
                        space1Y = false;
                        space2Y = false;
                        smlRect = false;
                        smlEllipse = false;
                        rectGradY = true;
                    }



                    if (rectY) {
    					let val2 = R.random_between(0, 1);

                        if (val2 <= 0.9) {

                        } else if (val2 > 0.9 && val2 <= 0.99) {
                        } else {
                            parallelCount.push("yes")
    						console.log(val2)

                            if (decPairs[9] <= 127.5) {
                               parallelColour.push("Black");
                            } else {
                                parallelColour.push("White");
                            }
                        }
                    }

                    if (smlRect) {}

                    if (ellipseY) {
    					let val = R.random_between(0, 1);
                        if (val < 0.9) {

                        } else {
    											console.log(val)

                            dotCount.push("yes")
                        }
                    }

                    if (smlEllipse) {

                    }

                    if (tri1Y) {
                        if (decPairs[11] <= 229.5) {

                            headingCount.push("East")


                        } else {


                            headingCount.push("West")


                        }


                    }

                    if (tri2Y) {

                        if (decPairs[11] <= 229.5) {

                            headingCount.push("East")
                        } else {

                            headingCount.push("West")

                        }
                    }

                    if (gradY) {
                        if (R.random_between(0, 1) < 0.5) {

                        } else {

                        }
                    }
                    if (rectGradY) {

                    }
                    if (space1Y) {}
                    if (space2Y) {}
                }
            }


        }

    }

    class GridLooper_stroke {
        constructor(k, l, c, sw) {
            this.k = k;
            this.l = l;
            this.c = c;
            this.sw = sw;
        }

        display() {

            if (decPairs[8] <= 127.5) {
                strokeColour.push("White")
            } else {
                strokeColour.push("Black")
            }

            for (let i = 0; i < this.k; i++) {
                for (let j = 0; j < this.l; j++) {

                    styleMaster = Math.floor(R.random_between(0, 6));

                    if (styleMaster == 0) {
                        rectY = true;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        space1Y = false;
                        space2Y = false;
                    } else if (styleMaster == 1) {
                        rectY = false;
                        ellipseY = true;
                        tri1Y = false;
                        tri2Y = false;
                        space1Y = false;
                        space2Y = false;
                    } else if (styleMaster == 2) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = true;
                        tri2Y = false;
                        space1Y = false;
                        space2Y = false;
                    } else if (styleMaster == 3) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = true;
                        space1Y = false;
                        space2Y = false;
                    } else if (styleMaster == 4) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        space1Y = true;
                        space2Y = false;
                    } else if (styleMaster == 5) {
                        rectY = false;
                        ellipseY = false;
                        tri1Y = false;
                        tri2Y = false;
                        space1Y = false;
                        space2Y = true;
                    }



                    if (decPairs[8] <= 127.5) {

                    } else {}

                    if (rectY) {

                    }

                    if (ellipseY) {

                    }

                    if (tri1Y) {
                        if (decPairs[11] <= 229.5) {


                        } else {



                        }
                    }

                    if (tri2Y) {
                        if (decPairs[11] <= 229.5) {


                        } else {


                        }
                    }

                    if (space1Y) {}
                    if (space2Y) {}
                }
            }
        }
    }



    for (let i = 0; i < countX; i++) {
        gridLoops1.push(new GridLooper(unit, unit, count, 0, 0));
    }

    for (let i = 0; i < 1; i++) {
        gridLoops2.push(new GridLooper(unit2, unit2, count2, 0, 0));
    }

    for (let i = 0; i < countX2; i++) {
        gridLoops_stroke.push(new GridLooper_stroke(unit3, unit3, count3, 0));
    }

    if (decPairs[7] <= 85) {

        features.push("Background: Gray")

    } else if (decPairs[7] > 85 && decPairs[7] < 170) {


        features.push("Background: Tint")

    } else {
        features.push("Background: Full")

    }

    for (let i = 0; i < gridLoops1.length; i++) {
        gridLoops1[i].display();
    }

    for (let i = 0; i < gridLoops2.length; i++) {
        gridLoops2[i].display();
    }

    for (let i = 0; i < gridLoops_stroke.length; i++) {
        gridLoops_stroke[i].display();
    }


    if (decPairs[3] <= 85) {
        features.push("Stroke: None")

    } else {
        features.push("Stroke: " + strokeColour)
        features.push("Stroke Grid: " + unit3 + "x" + unit3)

    }


    if (decPairs[11] <= 229.5) {
        features.push("Heading: East");
    } else {
        features.push("Heading: West");
    }




    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    if (parallelCount.length != 0) {
        features.push("Blinds: " + parallelCount.length + " " + parallelColour[0]);
    }

    featuresReduced=features;
    console.log(features);

}


  /////////

  else if (projectId === 42){


    "use strict";
    {

        const noise = {
            init(seed) {
                this.r = this.alea(seed);
              this.p = this.bp(this.r);
            },
            bp(random) {
                var i;
                var p = new Uint8Array(256);
                for (i = 0; i < 256; i++) {
                    p[i] = i;
                }
                for (i = 0; i < 255; i++) {
                    var r = i + ~~(random() * (256 - i));
                    var aux = p[i];
                    p[i] = p[r];
                    p[r] = aux;
                }
                return p;
            },

            masher() {
                var n = 0xefc8249d;
                return function(data) {
                    data = data.toString();
                    for (var i = 0; i < data.length; i++) {
                        n += data.charCodeAt(i);
                        var h = 0.02519603282416938 * n;
                        n = h >>> 0;
                        h -= n;
                        h *= n;
                        n = h >>> 0;
                        h -= n;
                        n += h * 0x100000000; // 2^32
                    }
                    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
                };
            },
            alea() {
                var s0 = 0;
                var s1 = 0;
                var s2 = 0;
                var c = 1;

                var mash = this.masher();
                s0 = mash(' ');
                s1 = mash(' ');
                s2 = mash(' ');

                for (var i = 0; i < arguments.length; i++) {
                    s0 -= mash(arguments[i]);
                    if (s0 < 0) {
                        s0 += 1;
                    }
                    s1 -= mash(arguments[i]);
                    if (s1 < 0) {
                        s1 += 1;
                    }
                    s2 -= mash(arguments[i]);
                    if (s2 < 0) {
                        s2 += 1;
                    }
                }
                mash = null;
                return function() {
                    var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                    s0 = s1;
                    s1 = s2;
                    return s2 = t - (c = t | 0);
                };
            },
        };


        noise.init(tokenData);
        let rd=noise.r;

        //THE PARAMETERS
        let palette_index = parseInt(Math.floor(rd()*27));
        let repeat = 1;
        if (rd()>0.95) repeat = 2;
        let scale_noise = 0.5 + rd() * 1.5;
        let n_sides = 100;
        let ns = rd();
        if (ns > 0.8) n_sides = 0;
        else if (ns > 0.3) n_sides = Math.floor(Math.pow(rd(),2)*3) + 4; // 4 to 6

        let huge = rd()>0.5;
        let half = rd()>0.7;
        let cut = rd()>0.5;
        let phat = rd()>0.6;
        let two_planets = rd() > 0.95;
        let excentred = (!two_planets && rd()>0.7);
        phat = phat&&!excentred&&(n_sides!=0);
        let spiral_colors = !two_planets&&!excentred&&!cut&&rd()>0.95;
        if(n_sides==0) {
            two_planets=false;
            excentred=false;
        }
        let dark = rd()>0.6;
        let bicolor = rd()>0.3;
        let donut = rd()>0.9;

        let palettesNames = [
            'Green(Y&B)',
            'Fluorescent Moss',
            'Geode',
            'Verdigris',
            'Monochrome',
            'Autumn is coming',
            'Sea Shore',
            'Boy and Girl',
            'Icy Blues',
            'Down in the forest',
            'Burning',
            'It\'s a long story',
            'Pastel',
            'Bright Sky',
            'Rust',
            'Aurora Skies',
            'From the forge',
            'Fire',
            'Floral Essence',
            'Bold choice, no doubt',
            'Too much purple',
            'Macha Strawberry',
            'Time for blood',
            'Cotton Candy',
            'Light breeze',
            'Teal to 11',
            'I miss yellow',
        ];
        features.push('Palette: '+palettesNames[palette_index]);

        if(repeat==1) {
            features.push('See Double Colors: No'); //0
        } else {
            features.push('See Double Colors: Yes');
        }
      if(scale_noise>1.0){
          features.push('Energy: High'); //9
      } else {
          features.push('Energy: Low');
      }
      switch(n_sides) {
          case 4:
              features.push('Shape: Square');
              break;
          case 5:
              features.push('Shape: Pentagon');
              break;
          case 6:
              features.push('Shape: Hexagon');
              break;
          case 0:
              features.push('Shape: Shapeless');
              break;
          default:
              features.push('Shape: Circle');
              break;
      }
      if(huge){
          features.push('Size: Huge');
      } else {
          features.push('Size: Medium');
      }
      if(half){
          features.push('Room: Spacious');
      } else {
          features.push('Room: Compact');
      }
      if(cut){
          features.push('Cut: Line');
      } else {
          features.push('Cut: None');
      }
        if(phat){
          features.push('Framed: Tightly');
      } else {
          features.push('Framed: Nicely');
      }
        if(two_planets) {
          features.push('System: Binary Star');
        } else if(excentred) {
          features.push('System: Corner');
        } else if (spiral_colors) {
          features.push('System: Spiral');
        } else {
          features.push('System: Planet');
        }

        if(dark){
          features.push('Time: Night');
        } else {
          features.push('Time: Day');
        }
        if(bicolor){
          features.push('Atmosphere: Yes');
        } else {
          features.push('Atmosphere: No');
        }
        if(donut){
          features.push('Fill: Rings');
        } else {
          features.push('Fill: Full');
        }

        console.log(features);


    }


    featuresReduced=features;

  }


  ////////////////
  else if (projectId===43){

    function p5() {
        this._lcg_random_state = null;
        this._gaussian_previous = false;
    }

    // variables used for random number generators
    const randomStateProp = '_lcg_random_state';
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    const m = 4294967296;
    // a - 1 should be divisible by m's prime factors
    const a = 1664525;
    // c and m should be co-prime
    const c = 1013904223;
    let y2 = 0;

    // Linear Congruential Generator that stores its state at instance[stateProperty]
    p5.prototype._lcg = function(stateProperty) {
      // define the recurrence relationship
      this[stateProperty] = (a * this[stateProperty] + c) % m;
      // return a float in [0, 1)
      // we've just used % m, so / m is always < 1
      return this[stateProperty] / m;
    };

    p5.prototype._lcgSetSeed = function(stateProperty, val) {
      // pick a random seed if val is undefined or null
      // the >>> 0 casts the seed to an unsigned 32-bit integer
      this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
    };

    p5.prototype.randomSeed = function(seed) {
      this._lcgSetSeed(randomStateProp, seed);
      this._gaussian_previous = false;
    };

    p5.prototype.random = function(min, max) {
      let rand;

      if (this[randomStateProp] != null) {
        rand = this._lcg(randomStateProp);
      } else {
        rand = Math.random();
      }
      if (typeof min === 'undefined') {
        return rand;
      } else if (typeof max === 'undefined') {
        if (min instanceof Array) {
          return min[Math.floor(rand * min.length)];
        } else {
          return rand * min;
        }
      } else {
        if (min > max) {
          const tmp = min;
          min = max;
          max = tmp;
        }

        return rand * (max - min) + min;
      }
    };

    p5.prototype.randomGaussian = function(mean, sd = 1) {
      let y1, x1, x2, w;
      if (this._gaussian_previous) {
        y1 = y2;
        this._gaussian_previous = false;
      } else {
        do {
          x1 = this.random(2) - 1;
          x2 = this.random(2) - 1;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        this._gaussian_previous = true;
      }

      const m = mean || 0;
      return y1 * sd + m;
    };

    p5.prototype.randomSeed(parseInt(tokenData.slice(0, 16), 16));

    let traits = [];
    let red = 0;
    let green = 0;
    let blue = 0;

    if(p5.prototype.random() < 0.05) {
      traits.push("Ghost edition: True");
      red = 220;
      green = 220;
      blue = 220;
      traits.push("Red channel: 220");
      traits.push("Green channel: 220");
      traits.push("Blue channel: 220");
    } else {
      traits.push("Ghost edition: False");
      red = p5.prototype.random(0, 255);
      green = p5.prototype.random(0, 255);
      blue = p5.prototype.random(0, 255);
      traits.push("Red channel: "+parseInt(red));
      traits.push("Green channel: "+parseInt(green));
      traits.push("Blue channel: "+parseInt(blue));
    }

    if(red > 200 || green > 200 || blue > 200) {
      traits.push("Light edition: True");
    } else {
      traits.push("Light edition: False");
    }

    if(red < 100 && green < 100 && blue < 100) {
      traits.push("Dark edition: True");
    } else {
      traits.push("Dark edition: False");
    }

    let kanjis = [
      "dream",
      "book",
      "tree",
      "fire",
      "ashes",
      "rain",
      "mountain",
      "moon",
      "sky",
      "poetry",
      "death",
      "soul",
      "sea"
    ];

    traits.push("Character: "+p5.prototype.random(kanjis));

    console.log(traits);

    features=traits;
    featuresReduced=traits;


  }



/////////////

else if (projectId===44){
  function setFeatures(hash, features, featuresReduced) {
    let PYRAMID_1,
        PYRAMID_2,
        PYRAMID_3,
        PYRAMID_4,
        PYRAMID_5,
        ANIMATING_PUPIL,
        PY_EYE,
        PY_EYE_INVERSE,
        PY_TOP_CIRCLE,
        PY_BOTTOM_CIRCLE,
        PY_TRIANGLE,
        PY_TRIANGLE_INVERSE,
        PY_PUPIL,

        BACKGROUND_TYPE,

        SHOW_TRI,
        TRI_T1,
        TRI_T2,
        TRI_C1,
        TRI_C2,
        TRI_TE,
        TRI_CE,
        TRI_N,
        TRI_SPACING,
        TRI_W,
        INVERTED_TRI,
        TRI_CROSS1,
        TRI_CROSS2,

        SHOW_COLUMN,
        COLUMN_T,
        COLUMN_W,
        SHOW_WINGS,
        WING_W,
        TOP_BOTTOM_ANIMATION,
        TOP_BOTTOM_MIN,
        TOP_BOTTOM_MAX,
        TOP_BOTTOM_W,
        SIDES_PRIMARY,
        SIDES_SECONDARY,
        SIDES_T,

        SHOW_ARCH_CORNERS,
        ARCH_E,
        ARCH_S,
        ARCH_DYN_E,
        ARCH_DYN_S,
        ARCH_E_ANIM,
        ARCH_S_ANIM,
        ARCH_DYN_E_ANIM,
        ARCH_DYN_S_ANIM,
        ARCH_SIZE_ADJ,
        ARCH_W,
        ARCH_SPACING,
        ARCH_INVERTED,
        ARCH_VERTED,
        ARCH_DOUBLE_COEFF,
        COLOR_SCHEME


    const prb = (x) => rnd() < x
    const btwn = (m, mx) => m + rnd() * (mx - m)
    const sample = (a) => a[Math.floor(a.length * rnd())]
    let seed = parseInt(hash.slice(0, 16), 16)
    function rnd() {
       seed ^= seed << 13
       seed ^= seed >> 17
       seed ^= seed << 5
       return (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000
    }

    let hshUsed = 0
    function hshrnd(h) {
      const str = tokenData.slice(2 + hshUsed, 2 + hshUsed + h)
      const num = parseInt(str, 16)
      hshUsed += h
      return num / (16**h)
    }
    const hshprb = (h, p) => hshrnd(h) < p


    const colorSeed = hshrnd(2)
    hshrnd(3)
    hshrnd(3)

    // matte 49%
    if (colorSeed < 0.49) {
      COLOR_SCHEME = 'Matte'

    // neon 16%
    }  else if (colorSeed < 0.65) {
      COLOR_SCHEME = 'Luminous'

    // neon dark 16%
    }  else if (colorSeed < 0.81) {
      COLOR_SCHEME = 'Shadow'

    // bright 16%
    }  else if (colorSeed < 0.97) {
      COLOR_SCHEME = 'Neon'

    // b&w 2%
    } else if (colorSeed < 0.99) {
      COLOR_SCHEME = 'Yin/Yang'

    // w&b 1%
    } else {
      COLOR_SCHEME = 'Yang/Yin'
    }



    PY_EYE = hshprb(1, 0.4275)
    const tCProb = hshprb(1, 0.5)
    const bCProb = hshprb(1, 0.5)
    const eIProb = hshprb(1, 0.5)
    const pt = hshrnd(2)

    PY_TOP_CIRCLE = !PY_EYE && tCProb // 30%
    PY_BOTTOM_CIRCLE = !PY_EYE && bCProb // 30%
    PY_EYE_INVERSE = !PY_EYE && !PY_TOP_CIRCLE && !PY_BOTTOM_CIRCLE && eIProb // 16%
    PY_TRIANGLE = pt < 0.85
    PY_TRIANGLE_INVERSE = pt > 0.85 && pt < 0.95
    PY_PUPIL = hshprb(1, 0.9)

    if (hshprb(1, 0.65)) PYRAMID_1 = true
    if (hshprb(1, 0.65)) PYRAMID_2 = true
    if (hshprb(1, 0.65)) PYRAMID_3 = true
    if (hshprb(1, 0.65)) PYRAMID_4 = true
    if (
      hshprb(1, 0.65)
      || !(PYRAMID_1 || PYRAMID_2 || PYRAMID_3 || PYRAMID_4)
    ) PYRAMID_5 = true

    if (hshprb(2, 0.02)) {
      ANIMATING_PUPIL = true
    }




    const bgSeed = hshrnd(2)

    if (bgSeed < 0.2) {
      BACKGROUND_TYPE = 'Sacred Geometry'
      // tri pyramid
      SHOW_TRI = true
      TRI_CROSS1 = hshprb(1, 0.1875)
      TRI_CROSS2 = hshprb(1, TRI_CROSS1 ? 0.5 : 0.1875)
      TRI_T1 = hshprb(1, 0.4275)
      TRI_T2 = hshprb(1, 0.4275)
      TRI_C1 = hshprb(1, 0.4275)
      TRI_C2 = hshprb(1, 0.4275)
      TRI_TE = hshprb(2, 0.1)
      TRI_CE = hshprb(2, 0.1)
      if (!(TRI_T1 || TRI_T2 || TRI_C1 || TRI_C2 || TRI_CROSS1 || TRI_CROSS2)) {
        if (hshprb(1, 0.5)) TRI_T1 = true
        else TRI_T2 = true
      }

      if (!TRI_T1 || !TRI_C1 || !TRI_CROSS1) {
        if (hshprb(1, 0.5)) TRI_T1 = true
        else TRI_C1 = true
      }

      TRI_W = 1 + rnd() * 4
      TRI_SPACING = 14 * TRI_W + rnd() * 30
      TRI_N = Math.floor(700/TRI_SPACING + rnd() * 12)
      INVERTED_TRI = hshprb(1, 0.3125)

    } else if (bgSeed < 0.9) {
      BACKGROUND_TYPE = 'Archs'

      SHOW_ARCH_CORNERS = true

      ARCH_SIZE_ADJ = rnd() * 500 - 100

      const archSeed = hshrnd(2)
      if (archSeed < 0.6) ARCH_VERTED = true
      else if (archSeed < 0.9) ARCH_INVERTED = true
      else {
        ARCH_VERTED = true
        ARCH_INVERTED = true
      }

      ARCH_W = btwn(1, 9)
      ARCH_SPACING = ARCH_W + rnd() * 5

      if (hshprb(1, 0.125)) ARCH_DOUBLE_COEFF = rnd() * ARCH_W

      ARCH_E = hshprb(1, 0.2) ? 0 : rnd() * 720 - 360
      ARCH_S = hshprb(1, 0.2) ? 0 : rnd() * 720 - 360
      const dynE = hshrnd(1)
      ARCH_DYN_E =
        dynE < 0.5 ? 0 :
        dynE < 0.75 ? rnd() * 0.6 - 0.3 :
        rnd() * 160 - 80
      const dynS = hshrnd(1)
      ARCH_DYN_S =
        dynS < 0.5 ? 0 :
        dynS < 0.75 ? rnd() * 0.6 - 0.3 :
        rnd() * 160 - 80


      if (hshprb(1, 0.1875)) ARCH_DYN_S = ARCH_DYN_E
      if (hshprb(2, 0.05)) ARCH_E_ANIM = btwn(2, 20) * (hshprb(1, 0.5) ? 1 : -1)
      if (hshprb(2, 0.05)) ARCH_S_ANIM = btwn(2, 20) * (hshprb(1, 0.5) ? 1 : -1)
      if (hshprb(2, 0.05)) ARCH_DYN_E_ANIM = btwn(600, 6600) * (hshprb(1, 0.5) ? 1 : -1)
      if (hshprb(2, 0.05)) ARCH_DYN_S_ANIM = btwn(600, 6600) * (hshprb(1, 0.5) ? 1 : -1)

    } else if (bgSeed < 0.99) {
      BACKGROUND_TYPE = 'Divinity'
      // column + wings
      COLUMN_W = 10 + rnd() * 40

      if (hshprb(1, 0.5)) {
        SHOW_COLUMN = true
        COLUMN_T = hshprb(1, 0.6875) ? btwn(110, 460) : btwn(530, 660)
      }

      if (hshprb(1, 0.125)) {
        SHOW_WINGS = true
      }

      if (hshprb(1, 0.125)) {
        TOP_BOTTOM_ANIMATION = true
        TOP_BOTTOM_MIN = btwn(390, 430)
        TOP_BOTTOM_MAX = TOP_BOTTOM_MIN + 40
        TOP_BOTTOM_W = Math.max(COLUMN_W/2, 3)
      }

      if (!SHOW_WINGS && !TOP_BOTTOM_ANIMATION && !SHOW_COLUMN) {
        SIDES_T = btwn(720, 820)
        SIDES_PRIMARY = true
        if (hshprb(1, 0.75)) {
          SIDES_SECONDARY = true
        }
      } else {
        SIDES_T = btwn(590, 665)
      }

      if (hshprb(2, 0.05)) {
        SIDES_PRIMARY = true
        if (hshprb(1, 0.75)) {
          SIDES_SECONDARY = true
        }
      }


    } else {
      BACKGROUND_TYPE = 'Purity'
    }


    const addFeatures = (str) => features.push(str)
    const addFeaturesReduced = (str) => featuresReduced.push(str)
    const addFeaturesBoth = (str) => {
      addFeatures(str)
      addFeaturesReduced(str)
    }

    addFeaturesBoth(`Color Spectrum: ${COLOR_SCHEME}`)
    addFeaturesBoth(`Background: ${BACKGROUND_TYPE}`)


    if (PY_EYE) {
      addFeaturesBoth('Eye of Providence')
    } else if (PY_TOP_CIRCLE && PY_BOTTOM_CIRCLE) {
      addFeaturesBoth('Infinite Gaze')
    } else if (PY_TOP_CIRCLE) {
      addFeaturesBoth('Downward Gaze')
    } else if (PY_BOTTOM_CIRCLE) {
      addFeaturesBoth('Upward Gaze')
    } else if (PY_EYE_INVERSE) {
      addFeaturesBoth('Golden Gaze')
    }

    if (!PY_PUPIL && !ANIMATING_PUPIL) {
      addFeaturesBoth('Blinded')
    } else if (ANIMATING_PUPIL) {
      addFeaturesBoth("Charon's Obol")
    }

    if (PY_TRIANGLE_INVERSE) {
      addFeaturesBoth('False Profit')
    } else if (!PY_TRIANGLE) {
      addFeaturesBoth('Invisible Hand')
    }

    if (
      (!PYRAMID_1 && !PYRAMID_3 && !PYRAMID_5)
      || (!PYRAMID_2 && !PYRAMID_4)
    ) {
      addFeaturesBoth('Monolithic')
    }


    if (BACKGROUND_TYPE === 'Divinity') {

      if (TOP_BOTTOM_ANIMATION) {
        addFeaturesBoth('Heaven and Earth')
      }

      if (SIDES_SECONDARY || SIDES_PRIMARY) {
        addFeaturesBoth('Vestigial Vessel')
      }

      if (SHOW_WINGS) {
        addFeaturesBoth('Angelic Affluence')
      }

      if (COLUMN_T) {
        addFeatures(`Astral Projection Coefficient: ${COLUMN_T.toFixed(4)}`)
        addFeaturesReduced('Astral Projection')
      }
    }

    if (BACKGROUND_TYPE === 'Archs') {

      const absS = (ARCH_S + 360) % 360
      const absE = (ARCH_E + 360) % 360
      if (!(
        ARCH_E ||
        ARCH_S ||
        ARCH_DYN_E ||
        ARCH_DYN_S ||
        ARCH_E_ANIM ||
        ARCH_S_ANIM ||
        ARCH_DYN_E_ANIM ||
        ARCH_DYN_S_ANIM
      )) {
        addFeaturesBoth('Legal Tender')

      } else if (ARCH_DYN_S && ARCH_DYN_S === ARCH_DYN_E) {
        addFeaturesBoth('Cycle of Rebirth')
      } else if (!ARCH_E && !ARCH_S) {
        addFeaturesBoth('Cosmic Contango')
      } else if (
        !ARCH_DYN_S && !ARCH_DYN_E &&
        absS - 60 < absE &&
        absS >= 130 && absE <= 230
      ) {
        addFeaturesBoth('Mystical Munificence')

      } else if (!ARCH_DYN_S && !ARCH_DYN_E) {
        addFeaturesBoth('Gravy Train')
      }

      if (ARCH_DYN_S || ARCH_DYN_E) {
        addFeaturesReduced(`Cosmic Inflation`)
        addFeatures(`Cosmic Inflation Rate: ${Math.abs(ARCH_DYN_S - ARCH_DYN_E).toFixed(4)}`)
      }

      if (ARCH_E_ANIM || ARCH_S_ANIM || ARCH_DYN_E_ANIM || ARCH_DYN_S_ANIM) {
        addFeaturesBoth('5D Time Dilation')
      }

      if (Math.abs(ARCH_S - ARCH_E)) {
        addFeaturesReduced(`Karmic Interest`)
        addFeatures(`Karmic Interest Rate: ${Math.abs(ARCH_S - ARCH_E).toFixed(4)}`)
      }

      if (ARCH_W) {
        addFeaturesReduced(`Financial Burden: ${Math.round(ARCH_W)}`)
        addFeatures(`Financial Burden: ${ARCH_W.toFixed(4)}`)
      }

      if (ARCH_DOUBLE_COEFF) {
        addFeaturesBoth('Arch Amulet')
      }

      if (ARCH_VERTED && ARCH_INVERTED) {
        addFeaturesBoth('Six Pillars')
      } else if (ARCH_INVERTED) {
        addFeaturesBoth('Blood Diamonds')
      } else if (ARCH_VERTED) {
        addFeaturesBoth('Three Jewels')
      }
    }


    if (BACKGROUND_TYPE === 'Geometric') {
      const cross = (TRI_CROSS1 || TRI_CROSS2)
      const circle = (TRI_C1 || TRI_C2)
      const triangle = (TRI_T1 || TRI_T2)

      if (TRI_CROSS1 && TRI_CROSS2) {
        addFeaturesBoth('Gilded Holy Cross')
      } else if (TRI_CROSS1) {
        addFeaturesBoth('Holy Cross')
      } else if (TRI_CROSS2) {
        addFeaturesBoth('Gilded Cross')
      }

      if (TRI_C1 && TRI_C2) {
        addFeaturesBoth('Gilded Holy Token')
      } else if (TRI_C1) {
        addFeaturesBoth('Holy Token')
      } else if (TRI_C2) {
        addFeaturesBoth('Gilded Token')
      }

      if (TRI_T1 && TRI_T2 && INVERTED_TRI) {
        addFeaturesBoth('Gilded Unholy Trinity')
      } else if (TRI_T1 && TRI_T2) {
        addFeaturesBoth('Gilded Holy Trinity')

      } else if (TRI_T1 && INVERTED_TRI) {
        addFeaturesBoth('Unholy Trinity')
      } else if (TRI_T1) {
        addFeaturesBoth('Holy Trinity')
      } else if (TRI_T2) {
        addFeaturesBoth('Gilded Trinity')
      }


      if (TRI_TE || TRI_CE) {
        addFeaturesBoth('Aura of Affluence')
      }
    }
  }


  setFeatures(tokenData, features, featuresReduced)
}




  ////////////

  else if (projectId===45){

    let seed = tokenData;

        let traits = []

        let dna = seed.substring(2, seed.length);

        const BOOLS = dna.split("").map(h => parseInt(Number("0x" + h), 10) % 2);
        const INTS = dna.split("").map(h => parseInt(Number("0x" + h), 10));
        const COLORS = dna.match(/.{2}/g).map(h => parseInt(Number("0x" + h), 10));

        OFFSET = (function () {
                o = COLORS[22] * INTS[5] * INTS[9];
                if (o < 100 && BOOLS[3]) {
                    o = o * COLORS[10] * 30;
                }
                else if (o > 5000 && BOOLS[3]) {
                    o = o * COLORS[15] * 1.2;
                }
                return o;
            })()

        traits.push("Offset: " + OFFSET)

        if (BOOLS[22] && BOOLS[5]){
            traits.push("Widener: Random");
        } else if(BOOLS[13]){
            traits.push("Widener: Static");
        } else {
            traits.push("Widener: None");
        }


        if (BOOLS[3]){
            traits.push("Pre-Wash: True");
            if (BOOLS[9]) {
                traits.push("Wash: True");
            } else {
                traits.push("Wash: False");
            }
        } else {
            traits.push("Pre-Wash: False");
            traits.push("Wash: False");
        }

        if (BOOLS[5]) {
            traits.push("Ring Expander: True");
        } else {
            traits.push("Ring Expander: False");
        }

        if (BOOLS[7]) {
            traits.push("Accelerator: True");
        } else {
            traits.push("Accelerator: False");
        }

        traits.push("Cell Alpha: " + Math.round(COLORS[1] * 0.6))

        features = traits;
        featuresReduced=features;
  }

  ////////

  else if (projectId===46){

      ! function (a, b, c, d, e, f, g, h, i) {
        function j(a) {
          var b, c = a.length,
            e = this,
            f = 0,
            g = e.i = e.j = 0,
            h = e.S = [];
          for (c || (a = [c++]); d > f;) h[f] = f++;
          for (f = 0; d > f; f++) h[f] = h[g = s & g + a[f % c] + (b = h[f])], h[g] = b;
          (e.g = function (a) {
            for (var b, c = 0, f = e.i, g = e.j, h = e.S; a--;) b = h[f = s & f + 1], c = c * d + h[s & (h[
              f] = h[g = s & g + b]) + (h[g] = b)];
            return e.i = f, e.j = g, c
          })(d)
        }

        function k(a, b) {
          var c, d = [],
            e = typeof a;
          if (b && "object" == e)
            for (c in a) try {
              d.push(k(a[c], b - 1))
            } catch (f) {}
          return d.length ? d : "string" == e ? a : a + "\0"
        }

        function l(a, b) {
          for (var c, d = a + "", e = 0; e < d.length;) b[s & e] = s & (c ^= 19 * b[s & e]) + d.charCodeAt(e++);
          return n(b)
        }

        function m(c) {
          try {
            return o ? n(o.randomBytes(d)) : (a.crypto.getRandomValues(c = new Uint8Array(d)), n(c))
          } catch (e) {
            return [+new Date, a, (c = a.navigator) && c.plugins, a.screen, n(b)]
          }
        }

        function n(a) {
          return String.fromCharCode.apply(0, a)
        }
        var o, p = c.pow(d, e),
          q = c.pow(2, f),
          r = 2 * q,
          s = d - 1,
          t = c["seed" + i] = function (a, f, g) {
            var h = [];
            f = 1 == f ? {
              entropy: !0
            } : f || {};
            var o = l(k(f.entropy ? [a, n(b)] : null == a ? m() : a, 3), h),
              s = new j(h);
            return l(n(s.S), b), (f.pass || g || function (a, b, d) {
              return d ? (c[i] = a, b) : a
            })(function () {
              for (var a = s.g(e), b = p, c = 0; q > a;) a = (a + c) * d, b *= d, c = s.g(1);
              for (; a >= r;) a /= 2, b /= 2, c >>>= 1;
              return (a + c) / b
            }, o, "global" in f ? f.global : this == c)
          };
        if (l(c[i](), b), g && g.exports) {
          g.exports = t;
          try {
            o = require("crypto")
          } catch (u) {}
        } else h && h.amd && h(function () {
          return t
        })
      }(this, [], Math, 256, 6, 52, "object" == typeof module && module, "function" == typeof define && define,
        "random");

      (function (global) {
        var module = global.noise = {}

        function Grad(x, y, z) {
          this.x = x
          this.y = y
          this.z = z
        }

        Grad.prototype.dot3 = function (x, y, z) {
          return this.x * x + this.y * y + this.z * z
        }

        var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
          new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
          new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
        ]

        var p = [151, 160, 137, 91, 90, 15,
          131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21,
          10,
          23,
          190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
          33,
          88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27,
          166,
          77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40,
          244,
          102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200,
          196,
          135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124,
          123,
          5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
          28,
          42,
          223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
          129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
          228,
          251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239,
          107,
          49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
          138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ]
        // To remove the need for index wrapping, double the permutation table length
        var perm = new Array(512)
        var gradP = new Array(512)

        // This isn't a very good seeding function, but it works ok. It supports 2^16
        // different seed values. Write something better if you need more seeds.
        module.seed = function (seed) {
          if (seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536
          }

          seed = Math.floor(seed)
          if (seed < 256) {
            seed |= seed << 8
          }

          for (var i = 0; i < 256; i++) {
            var v
            if (i & 1) {
              v = p[i] ^ (seed & 255)
            } else {
              v = p[i] ^ ((seed >> 8) & 255)
            }

            perm[i] = perm[i + 256] = v
            gradP[i] = gradP[i + 256] = grad3[v % 12]
          }
        }

        module.seed(0)

        // Skewing and unskewing factors for 2, 3, and 4 dimensions
        var F2 = 0.5 * (Math.sqrt(3) - 1)
        var G2 = (3 - Math.sqrt(3)) / 6

        var F3 = 1 / 3
        var G3 = 1 / 6



        // ##### Perlin noise stuff
        function fade(t) {
          return t * t * t * (t * (t * 6 - 15) + 10)
        }

        function lerp(a, b, t) {
          return (1 - t) * a + t * b
        }

        // 3D Perlin Noise
        module.perlin3 = function (x, y, z) {
          // Find unit grid cell containing point
          var X = Math.floor(x)
          var Y = Math.floor(y)
          var Z = Math.floor(z)
          // Get relative xyz coordinates of point within that cell
          x = x - X
          y = y - Y
          z = z - Z
          // Wrap the integer cells at 255 (smaller integer period can be introduced here)
          X = X & 255
          Y = Y & 255
          Z = Z & 255

          // Calculate noise contributions from each of the eight corners
          var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z)
          var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1)
          var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z)
          var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1)
          var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z)
          var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1)
          var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z)
          var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1)

          // Compute the fade curve value for x, y, z
          var u = fade(x)
          var v = fade(y)
          var w = fade(z)

          // Interpolate
          return lerp(
            lerp(
              lerp(n000, n100, u),
              lerp(n001, n101, u), w),
            lerp(
              lerp(n010, n110, u),
              lerp(n011, n111, u), w),
            v)
        }
      })(this)

      //  This will manage the random number generator
      const shuffleArray = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array
      }

      //  Define the colour palettes
      const palettes = []
      palettes.push(["1b065e", "ff47da", "ff87ab", "fcc8c2", "f5eccd"])
      palettes.push(["eafdf8", "e5e9ec", "ddcad9", "d1b1cb", "7c616c"])
      palettes.push(["d7d9b1", "84acce", "827191", "7d1d3f", "512500"])
      palettes.push(["93b5c6", "ddedaa", "f0cf65", "d7816a", "bd4f6c"])

      palettes.push(["114b5f", "1a936f", "88d498", "c6dabf", "f3e9d2"])
      palettes.push(["22115e", "1b4394", "87c6d4", "bfd9d1", "dcf2d0"])
      palettes.push(["5e114e", "6b1b94", "9587d4", "bfc7d9", "d0f2e6"])
      palettes.push(["5e2011", "941b43", "d487c6", "d1bfd9", "d0dcf2"])
      palettes.push(["4f5e11", "946b1b", "d49587", "d9bfc7", "e6d0f2"])
      palettes.push(["115e20", "43941b", "c6d487", "d9d1bf", "f2d0dc"])

      palettes.push(["bbdef0", "00a6a6", "efca08", "f49f0a", "f08700"])
      palettes.push(["f0bbde", "a600a6", "07f0c9", "0af59f", "00f088"])
      palettes.push(["def0bb", "a6a600", "c907f0", "9f0af5", "8800f0"])
      palettes.push(["bbdef0", "00a6a6", "f0c907", "f59f0a", "f08800"])
      palettes.push(["1be7ff", "6eeb83", "e4ff1a", "ffb800", "ff5714"])
      palettes.push(["3a405a", "aec5eb", "f9dec9", "e9afa3", "685044"])

      const paletteName = []
      paletteName.push('From the nighttime neon city wasteland of the 80s music scene')
      paletteName.push('Winter')
      paletteName.push('Grove')
      paletteName.push('Tuscany')

      paletteName.push('Delta')
      paletteName.push('Spray')
      paletteName.push('7pm')
      paletteName.push('Not Plum')
      paletteName.push('Abandoned Flip-Flop')
      paletteName.push('Woodland Camping')

      paletteName.push('7am')
      paletteName.push('False Colour Nebular')
      paletteName.push('Twilight Field')
      paletteName.push('3pm')
      paletteName.push('C64')
      paletteName.push('In the White Room at 3am')

      //  Seed the randomiser with the hash
      Math.seedrandom(tokenData)

      //  Define all the settings we need.
      //  This only happens once
      let lineTile1 = Math.random()
      let lineTile2 = Math.random()
      let borderChance = Math.random()
      let tiles = Math.floor((((lineTile1 + (lineTile2 / 2)) / 1.5) * 14) + 5)
      let lines = Math.floor(9 - (lineTile1 + lineTile2) / 2 * 8) + 1
      let phase = false

      let double = Math.random() < 0.0234375

      let linesBoost = 0
      if (Math.random() < 0.1) linesBoost--
      if (Math.random() < 0.1) linesBoost -= 2
      if (Math.random() < 0.1) linesBoost++
      if (Math.random() < 0.1) linesBoost += 2
      lines += linesBoost
      if (tiles >= 16) lines--
      if (lines < 1) lines = 1

      if (tiles > 17 && lines > 5) lines = 6

      let chance = 0.5
      let invertChance = 0.4
      let inverted = false
      let pickSelector = Math.random()
      let format = 'Normal'

      if (pickSelector < 0.75) {
        if (pickSelector < 0.6) {
          invertChance = 0.2
          if (pickSelector < 0.2) {
            format = 'Middle'
          } else {
            format = 'Noise'
          }
        } else {
          if (Math.random() < 0.5) {
            format = 'Sideways'
          } else {
            format = 'Top-bottom'
          }
        }
      }

      if (Math.random() <= invertChance) inverted = true

      const paletteIndex = Math.floor(Math.random() * palettes.length)
      const thisPalette = shuffleArray(palettes[paletteIndex])
      let startCol = thisPalette.pop()
      let endCol = thisPalette.pop()
      const fixedStartCol = JSON.parse(JSON.stringify(startCol))
      const fixedEndCol = JSON.parse(JSON.stringify(endCol))

      let composite = 'darken'
      if (Math.random() < 0.075) {
        composite = 'exclusion'
      }

      let fill = 'Normal'
      let target = 0.2
      if (paletteIndex === 0) target = 0.8
      if (Math.random() < target) {
        fill = 'Left-right'
        if (Math.random() < 0.5) {
          fill = 'Top-down'
        }
        if (Math.random() < 0.2) {
          const radType = Math.random()
          fill = 'Radial'
          if (radType < 0.4) {
            fill = 'Radial-tl'
          }
          if (radType < 0.3) {
            fill = 'Radial-tr'
          }
          if (radType < 0.2) {
            fill = 'Radial-bl'
          }
          if (radType < 0.1) {
            fill = 'Radial-br'
          }
        }
      }
      if (fill !== 'Normal' && Math.random() <= 0.1) phase = true
      if (composite === 'exclusion' && Math.random() <= 0.25) phase = true

      let special = 'None'
      let rotation = 0
      const specialChance = Math.random()
      if (Math.random() <= 0.05) {
        rotation = Math.floor(Math.random() * 4) * 90
        special = 'scales'
        if (specialChance < 0.76) special = 'feather'
        if (specialChance < 0.55) special = 'flow'
        if (specialChance < 0.38) special = 'weave'
        if (specialChance < 0.24) special = 'tiles'
        if (specialChance < 0.13) special = 'zig'
        if (specialChance < 0.05) special = 'zag'
      }

      let decoration = 'None'
      if (Math.random() <= 0.07) {
        decoration = 'cornerRose'
        if (Math.random() < 0.1 && !(tiles % 2) && tiles > 6) decoration = 'CornerRoseMiddle'
      }
      if (!(tiles % 2)) {
        if (Math.random() <= 0.08) {
          decoration = 'rose'
          if (Math.random() < 0.25) decoration = 'bigRose'
        }
      }

      if (typeof (featuresObj) === 'undefined') {
        featuresObj = {}
      }
      if (typeof (features) === 'undefined') {
        features = []
      }

      featuresObj.Tiles = `${tiles}x${tiles}`
      featuresObj.Lines = lines
      featuresObj.Boosted = linesBoost
      featuresObj.Format = format
      featuresObj.Reversed = inverted
      featuresObj.Pattern = special
      featuresObj.decoration = decoration
      if (featuresObj.decoration === 'cornerRose') featuresObj.decoration = 'Corner Rose'
      if (featuresObj.decoration === 'CornerRoseMiddle') featuresObj.decoration = 'Corner + Middle Rose'
      if (featuresObj.decoration === 'rose') featuresObj.decoration = 'Rose'
      if (featuresObj.decoration === 'bigRose') featuresObj.decoration = 'Big Rose'
      featuresObj.Palette = paletteName[paletteIndex]
      featuresObj.Fill = fill
      featuresObj.Rotation = rotation
      featuresObj.Inverted = composite === 'exclusion'
      featuresObj.Doubled = double
      featuresObj.Phased = phase

      features.push(`Series: One`)
      features.push(`Tiles: ${featuresObj.Tiles}`)
      features.push(`Lines: ${featuresObj.Lines}`)
      features.push(`Boosted: ${featuresObj.Boosted}`)
      features.push(`Format: ${featuresObj.Format}`)
      features.push(`Reversed: ${featuresObj.Reversed}`)
      features.push(`Pattern: ${featuresObj.Pattern}`)
      features.push(`Decoration: ${featuresObj.decoration}`)
      features.push(`Palette: ${featuresObj.Palette}`)
      features.push(`Fill: ${featuresObj.Fill}`)
      features.push(`Rotation: ${featuresObj.Rotation}`)
      features.push(`Inverted: ${featuresObj.Inverted}`)
      features.push(`Doubled: ${featuresObj.Doubled}`)
      features.push(`Phased: ${featuresObj.Phased}`)

      featuresReduced=features;
  }

  /////////////

  else if (projectId===47){
    function p5() {
        this._lcg_random_state = null;
        this._gaussian_previous = false;
    }

    // variables used for random number generators
    const randomStateProp = '_lcg_random_state';
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    const m = 4294967296;
    // a - 1 should be divisible by m's prime factors
    const a = 1664525;
    // c and m should be co-prime
    const c = 1013904223;
    let y2 = 0;

    // Linear Congruential Generator that stores its state at instance[stateProperty]
    p5.prototype._lcg = function(stateProperty) {
      // define the recurrence relationship
      this[stateProperty] = (a * this[stateProperty] + c) % m;
      // return a float in [0, 1)
      // we've just used % m, so / m is always < 1
      return this[stateProperty] / m;
    };

    p5.prototype._lcgSetSeed = function(stateProperty, val) {
      // pick a random seed if val is undefined or null
      // the >>> 0 casts the seed to an unsigned 32-bit integer
      this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
    };

    p5.prototype.randomSeed = function(seed) {
      this._lcgSetSeed(randomStateProp, seed);
      this._gaussian_previous = false;
    };

    p5.prototype.random = function(min, max) {
      let rand;

      if (this[randomStateProp] != null) {
        rand = this._lcg(randomStateProp);
      } else {
        rand = Math.random();
      }
      if (typeof min === 'undefined') {
        return rand;
      } else if (typeof max === 'undefined') {
        if (min instanceof Array) {
          return min[Math.floor(rand * min.length)];
        } else {
          return rand * min;
        }
      } else {
        if (min > max) {
          const tmp = min;
          min = max;
          max = tmp;
        }

        return rand * (max - min) + min;
      }
    };

    p5.prototype.randomGaussian = function(mean, sd = 1) {
      let y1, x1, x2, w;
      if (this._gaussian_previous) {
        y1 = y2;
        this._gaussian_previous = false;
      } else {
        do {
          x1 = this.random(2) - 1;
          x2 = this.random(2) - 1;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        this._gaussian_previous = true;
      }

      const m = mean || 0;
      return y1 * sd + m;
    };

    var size = 1

    p5.prototype.randomSeed(parseInt(tokenData.slice(0, 16), 16));

    var traits = [];

    var iniStars = parseInt(p5.prototype.random(120, 200));
    var minSize = p5.prototype.random(size*0.1, size*1);
    var maxSize = p5.prototype.random(size*2, size*6);
    var minSpeed = p5.prototype.random(size*0.05, size*0.08);
    var maxSpeed = p5.prototype.random(size*0.15, size*0.3);
    var linkForce = p5.prototype.random(size*50, size*65);
    var colorLink = p5.prototype.random(12, 240);
    var lineWeight = p5.prototype.random(size*0.25, size*1.5);
    var colorR = p5.prototype.random(50, 255);
    var colorG = p5.prototype.random(50, 255);
    var colorB = p5.prototype.random(50, 255);
    var alphaL = p5.prototype.random(200, 255);
    var backgroundR = p5.prototype.random(0, 20)
    var backgroundB = p5.prototype.random(0, 20)
    var backgroundG = p5.prototype.random(0, 20)
    var fullTrait = p5.prototype.random(10)


      //STARS
      if(iniStars < 150){
        traits.push("Sky type: Calm Night")
      }
      else{
        // console.log('stars: ' + iniStars)
        traits.push("Sky type: Starry Night")
      }

      if(maxSize >= size*0 && maxSize <=size*3.2) {
        // console.log('maxSize ' + maxSize)
        traits.push("Star size: Dwarf Star")
        }
      else if(maxSize > size*3.2 && maxSize <= size*4.5){
        // console.log('maxSize ' + maxSize)
        traits.push("Star size: Giant Star")
        }
      else {
        // console.log('maxSize ' + maxSize)
        traits.push("Star size: Super Giant Star")
        }
      if(maxSpeed < size*0.2){
        // console.log("Speed: " + maxSpeed)
        traits.push("Speed: Low")
      } else {
        // console.log("Speed: " + maxSpeed)
        traits.push("Speed: Fast")
      }

      if(lineWeight >= size*0.25 && lineWeight < size*0.4){
        // console.log('lineWeight ' + lineWeight)
        traits.push("Stroke: Low")
        }
      else if(lineWeight >= size*0.4 && lineWeight < size*1.2){
        // console.log('lineWeight ' + lineWeight)
        traits.push("Stroke: Regular")
        }
      else if(lineWeight >= size*1.2) {
        // console.log('lineWeight ' + lineWeight)
        traits.push("Stroke: Bold")
        }

      //BACKGROUND
      if(backgroundR < 6 && backgroundG < 6 && backgroundB < 6){
        // console.log("red " + backgroundR);
        // console.log("green " + backgroundG);
        // console.log("blue " + backgroundB);
        traits.push("Light pollution: Low")
        }
      else if(backgroundR > 15 || backgroundG > 15 || backgroundB > 15){
        // console.log("red " + backgroundR);
        // console.log("green " + backgroundG);
        // console.log("blue " + backgroundB);
        traits.push("Light pollution: Hard")
        }
      else if(backgroundR > 6 && backgroundR < 15 || backgroundG > 6 && backgroundG < 15 || backgroundB > 6 && backgroundB < 15){
        // console.log("red " + backgroundR);
        // console.log("green " + backgroundG);
        // console.log("blue " + backgroundB);
        traits.push("Light pollution: Regular")
        }

      //PLANETS
      if(fullTrait < 0.1){
        traits.push("Lucky Night: On")
        traits.push("Aldebaran: Visible")
        traits.push("Mars: Visible")
        traits.push("Moon: Visible")
        traits.push("Sirio: Visible")
        traits.push("Comet: Visible")

      }else{
        traits.push("Lucky Night: Off")
      	var aldebaranRandom = p5.prototype.random(10)
      	var marsRandom = p5.prototype.random(10)
      	var moonRandom = p5.prototype.random(10)
      	var sirioRandom = p5.prototype.random(10)
      	var cometProb = p5.prototype.random(10)

        if(aldebaranRandom > 4){
          // console.log('aldebaranRadius ' + aldebaranRadius)
          traits.push("Aldebaran: Visible")
        }else{
          // console.log('aldebaranRadius ' + aldebaranRadius)
          traits.push("Aldebaran: Hidden" )
        }

        if(marsRandom > 6){
          // console.log('marsRadius ' + marsRadius)
          traits.push("Mars: Visible")
        }else{
          // console.log('marsRadius ' + marsRadius)
          traits.push("Mars: Hidden")
        }

        if(moonRandom > 2){
          // console.log('moonRadius ' + moonRadius)
          traits.push("Moon: Visible")
        } else {
          // console.log('moonRadius ' + moonRadius)
          traits.push("Moon: Hidden")
        }

        if(sirioRandom > 8){
          // console.log('sirioRadius ' + sirioRadius)
          traits.push("Sirio: Visible")
        } else {
          // console.log('sirioRadius ' + sirioRadius)
          traits.push("Sirio: Hidden")
        }

        //COMETS
        if(cometProb < 0.5){
          // console.log("Comet: Visible")
          traits.push("Comet: Visible")
        } else {
          // console.log("Comet: Hidden")
          traits.push("Comet: Hidden")
        }
      }

    console.log(traits);

    features=traits;
    featuresReduced=traits;

  }




  ////////


  else if (projectId === 48){

    let hp = [];
    let hashstring = "";





    //take everything after the 0x and get the hash pairs
    hashstring = tokenData.substring(2)
    for (let i = 0; i < hashstring.length / 2; i++) {
      hp.push(unhex(hashstring.substring(i + i, i + i + 2)));
    }

    //begin features collection


     if (hp[2]>128) features.push("Layer: color disk");
      if (hp[3] >128) {
       if(hp[15] > 25){
         features.push("Layer: hash string loop")
       } else {
         features.push("Layer: hash string runners")
       }
      }
      if (hp[4] >128) features.push("Layer: electrons");
      if (hp[5] >128) features.push("Layer: hash grid");
      if (hp[6] >128) features.push("Layer: floor grid");
      if (hp[7] >128) features.push("Layer: orb");
      if (hp[8] >128) features.push("Layer: gradient");
      if(hp[23]>128 && hp[11]>=128 && hp[10]>=128) features.push("Frame: color");
      if(hp[23]>128 && hp[11]<128 && hp[10]>=128) features.push("Frame: white");
      if(hp[23]>128 && hp[11]>=128 && hp[10]<128) features.push("Frame: black");
    console.log(Math.floor(mapperz(hp[4], 0, 255, 0, 3.999)));
    console.log(hp[4]);
      switch (Math.floor(mapperz(hp[4], 0, 255, 0, 3.999))) {
        case 0:
          features.push("Words: color");
          break;
        case 1:
          features.push("Words: color");
          break;
        case 2:
          features.push("Words: b/w");
          break;
        case 3:
          features.push("Words: b/w");
          break;
      }

    featuresReduced = features

    //print features to console
    for (let i = 0; i < features.length; i++) {
      console.log(features[i]);
    }


    // maps the hp to a value between 0 and 32
    function R(_num) {
      return Math.floor(mapperz(_num, 0, 255, 0, 32));
    }

    //vanilla js replacement for the p5.js map function
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

    function unhex(n) {
      return parseInt(`0x${n}`, 16);
    }
  }

  //////

else if (projectId===47){

  function p5() {
      this._lcg_random_state = null;
      this._gaussian_previous = false;
  }

  // variables used for random number generators
  const randomStateProp = '_lcg_random_state';
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
  // m is basically chosen to be large (as it is the max period)
  // and for its relationships to a and c
  const m = 4294967296;
  // a - 1 should be divisible by m's prime factors
  const a = 1664525;
  // c and m should be co-prime
  const c = 1013904223;
  let y2 = 0;

  // Linear Congruential Generator that stores its state at instance[stateProperty]
  p5.prototype._lcg = function(stateProperty) {
    // define the recurrence relationship
    this[stateProperty] = (a * this[stateProperty] + c) % m;
    // return a float in [0, 1)
    // we've just used % m, so / m is always < 1
    return this[stateProperty] / m;
  };

  p5.prototype._lcgSetSeed = function(stateProperty, val) {
    // pick a random seed if val is undefined or null
    // the >>> 0 casts the seed to an unsigned 32-bit integer
    this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
  };

  p5.prototype.randomSeed = function(seed) {
    this._lcgSetSeed(randomStateProp, seed);
    this._gaussian_previous = false;
  };

  p5.prototype.random = function(min, max) {
    let rand;

    if (this[randomStateProp] != null) {
      rand = this._lcg(randomStateProp);
    } else {
      rand = Math.random();
    }
    if (typeof min === 'undefined') {
      return rand;
    } else if (typeof max === 'undefined') {
      if (min instanceof Array) {
        return min[Math.floor(rand * min.length)];
      } else {
        return rand * min;
      }
    } else {
      if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
      }

      return rand * (max - min) + min;
    }
  };

  p5.prototype.randomGaussian = function(mean, sd = 1) {
    let y1, x1, x2, w;
    if (this._gaussian_previous) {
      y1 = y2;
      this._gaussian_previous = false;
    } else {
      do {
        x1 = this.random(2) - 1;
        x2 = this.random(2) - 1;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1);
      w = Math.sqrt(-2 * Math.log(w) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      this._gaussian_previous = true;
    }

    const m = mean || 0;
    return y1 * sd + m;
  };

  var size = 1

  p5.prototype.randomSeed(parseInt(tokenData.slice(0, 16), 16));

  var traits = [];

  var iniStars = parseInt(p5.prototype.random(120, 200));
  var minSize = p5.prototype.random(size*0.1, size*1);
  var maxSize = p5.prototype.random(size*2, size*6);
  var minSpeed = p5.prototype.random(size*0.05, size*0.08);
  var maxSpeed = p5.prototype.random(size*0.15, size*0.3);
  var linkForce = p5.prototype.random(size*50, size*65);
  var colorLink = p5.prototype.random(12, 240);
  var lineWeight = p5.prototype.random(size*0.25, size*1.5);
  var colorR = p5.prototype.random(50, 255);
  var colorG = p5.prototype.random(50, 255);
  var colorB = p5.prototype.random(50, 255);
  var alphaL = p5.prototype.random(200, 255);
  var backgroundR = p5.prototype.random(0, 20)
  var backgroundB = p5.prototype.random(0, 20)
  var backgroundG = p5.prototype.random(0, 20)
  var fullTrait = p5.prototype.random(10)


    //STARS
    if(iniStars < 150){
      traits.push("Sky type: Calm Night")
    }
    else{
      // console.log('stars: ' + iniStars)
      traits.push("Sky type: Starry Night")
    }

    if(maxSize >= size*0 && maxSize <=size*3.2) {
      // console.log('maxSize ' + maxSize)
      traits.push("Star size: Dwarf Star")
      }
    else if(maxSize > size*3.2 && maxSize <= size*4.5){
      // console.log('maxSize ' + maxSize)
      traits.push("Star size: Giant Star")
      }
    else {
      // console.log('maxSize ' + maxSize)
      traits.push("Star size: Super Giant Star")
      }
    if(maxSpeed < size*0.2){
      // console.log("Speed: " + maxSpeed)
      traits.push("Speed: Low")
    } else {
      // console.log("Speed: " + maxSpeed)
      traits.push("Speed: Fast")
    }

    if(lineWeight >= size*0.25 && lineWeight < size*0.4){
      // console.log('lineWeight ' + lineWeight)
      traits.push("Stroke: Low")
      }
    else if(lineWeight >= size*0.4 && lineWeight < size*1.2){
      // console.log('lineWeight ' + lineWeight)
      traits.push("Stroke: Regular")
      }
    else if(lineWeight >= size*1.2) {
      // console.log('lineWeight ' + lineWeight)
      traits.push("Stroke: Bold")
      }

    //BACKGROUND
    if(backgroundR < 6 && backgroundG < 6 && backgroundB < 6){
      // console.log("red " + backgroundR);
      // console.log("green " + backgroundG);
      // console.log("blue " + backgroundB);
      traits.push("Light pollution: Low")
      }
    else if(backgroundR > 15 || backgroundG > 15 || backgroundB > 15){
      // console.log("red " + backgroundR);
      // console.log("green " + backgroundG);
      // console.log("blue " + backgroundB);
      traits.push("Light pollution: Hard")
      }
    else if(backgroundR > 6 && backgroundR < 15 || backgroundG > 6 && backgroundG < 15 || backgroundB > 6 && backgroundB < 15){
      // console.log("red " + backgroundR);
      // console.log("green " + backgroundG);
      // console.log("blue " + backgroundB);
      traits.push("Light pollution: Regular")
      }

    //PLANETS
    if(fullTrait < 0.1){
      traits.push("Lucky Night: On")
      traits.push("Aldebaran: Visible")
      traits.push("Mars: Visible")
      traits.push("Moon: Visible")
      traits.push("Sirio: Visible")
      traits.push("Comet: Visible")

    }else{
      traits.push("Lucky Night: Off")
    	var aldebaranRandom = p5.prototype.random(10)
    	var marsRandom = p5.prototype.random(10)
    	var moonRandom = p5.prototype.random(10)
    	var sirioRandom = p5.prototype.random(10)
    	var cometProb = p5.prototype.random(10)

      if(aldebaranRandom > 4){
        // console.log('aldebaranRadius ' + aldebaranRadius)
        traits.push("Aldebaran: Visible")
      }else{
        // console.log('aldebaranRadius ' + aldebaranRadius)
        traits.push("Aldebaran: Hidden" )
      }

      if(marsRandom > 6){
        // console.log('marsRadius ' + marsRadius)
        traits.push("Mars: Visible")
      }else{
        // console.log('marsRadius ' + marsRadius)
        traits.push("Mars: Hidden")
      }

      if(moonRandom > 2){
        // console.log('moonRadius ' + moonRadius)
        traits.push("Moon: Visible")
      } else {
        // console.log('moonRadius ' + moonRadius)
        traits.push("Moon: Hidden")
      }

      if(sirioRandom > 8){
        // console.log('sirioRadius ' + sirioRadius)
        traits.push("Sirio: Visible")
      } else {
        // console.log('sirioRadius ' + sirioRadius)
        traits.push("Sirio: Hidden")
      }

      //COMETS
      if(cometProb < 0.5){
        // console.log("Comet: Visible")
        traits.push("Comet: Visible")
      } else {
        // console.log("Comet: Hidden")
        traits.push("Comet: Hidden")
      }
    }

  console.log(traits);

  features=traits;
  featuresReduced=traits;

}
////////

else if (projectId===49){

var DEFAULT_SIZE_R=800,WIDTH_R=600,HEIGHT_R=600,DIM_R=Math.min(WIDTH_R,HEIGHT_R),M_2=DIM_R/DEFAULT_SIZE_R;let cols_R,rows_R,oX_R,oY_R,canvas_R=DEFAULT_SIZE_R*M_2,ttlPnts_R=5,grdSprSz_R=100*M_2,grdGap_R=170*M_2;cols=4,rows=4,oX_R=80,oY_R=80;let rectCoors_R={x:[],y:[]};function setGridType_R(e){switch(e){case 0:ttlPnts=Math.round(R_R.random_between(10,80)),cols=2,rows=2,grdSprSz_R=250*M_2,grdGap_R=400*M_2,oX_R=80*M_2,oY_R=80*M_2,fontsize_R=200*M_2,yOff_R=175*M_2,triSz_R=48*M_2,sqrSz_R=80*M_2,cirSz_R=80*M_2;break;case 1:ttlPnts=5,cols=4,rows=4,grdSprSz_R=100*M_2,grdGap_R=170*M_2,oX_R=88*M_2,oY_R=88*M_2,fontsize_R=72*M_2,yOff_R=80*M_2,triSz_R=28*M_2,sqrSz_R=40*M_2,cirSz_R=40*M_2;break;case 2:ttlPnts=5,cols=8,rows=8,grdSprSz_R=70*M_2,grdGap_R=95*M_2,oX_R=32*M_2,oY_R=32*M_2,fontsize_R=16*M_2,yOff_R=0,triSz_R=14*M_2,sqrSz_R=20*M_2,cirSz_R=20*M_2}}function mapRange_R(e,_,r,t,R){return Math.round(t+(R-t)*(e-_)/(r-_))}var hashPairs_R=[],gridHashPairs_R=[],decPairs_R=[];let myHash_R;function splitHash_R(e){let _=myHash_R.length;for(let e=0;e<_;e++)for(let _=0;_<32;_++)hashPairs_R.push(myHash_R[e].slice(2+2*_,4+2*_))}function getDecPairs_R(){return decPairs_R=hashPairs_R.map(e=>parseInt(e,16))}myHash_R=[tokenData];class Random_R{constructor(e){this.seed=e}random_dec(){return this.seed^=this.seed<<13,this.seed^=this.seed>>17,this.seed^=this.seed<<5,(this.seed<0?1+~this.seed:this.seed)%1e3/1e3}random_between(e,_){return e+(_-e)*this.random_dec()}random_int(e,_){return Math.floor(this.random_between(e,_+1))}random_choice(e){return e[Math.floor(this.random_between(0,.99*e.length))]}}splitHash_R(),getDecPairs_R();let mySeed_R=parseInt(tokenData.slice(0,16),16),R_R=new Random_R(mySeed_R);function getOccurrence_R(e,_){var r=0;return e.forEach(e=>e===_&&r++),r}var gl={tf:!1,txt:155,lines:0,bg:200};function setHashTxt_R(e,_){switch(_){case 0:gridHashPairs_R.push("0x","..","..",myHash_R[0][64]+myHash_R[0][65]);break;case 1:gridHashPairs_R=["0x"].concat(hashPairs_R.slice(0,e).concat(["..."]).concat(hashPairs_R.slice(e+18,32)));break;case 2:for(var r=0;r<myHash_R[0].length;r++)0==r||1==r||64==r||65==r||gridHashPairs_R.push(myHash_R[0][r]);(gridHashPairs_R=["0x"].concat(gridHashPairs_R)).push(myHash_R[0][64]+myHash_R[0][65])}}function createGrid_R(){for(let r=0;r<rows;r++)for(let t=0;t<cols;t++){var e=r*grdGap_R,_=t*grdGap_R;rectCoors_R.x.push(_+oX_R),rectCoors_R.y.push(e+oY_R)}hashTxtCreate_R()}let font_R,fontsize_R=72,yOff_R=80;function hashTxtCreate_R(){for(let e=0;e<gridHashPairs_R.length;e++)drawHashTxt_R(gridHashPairs_R[e],rectCoors_R.x[e],rectCoors_R.y[e])}function drawHashTxt_R(e,_,r){}function getPoints_R(e,_){let r={x:[],y:[]};for(let t=0;t<ttlPnts;t++)r.x.push(R_R.random_between(e,e+grdSprSz_R)),r.y.push(R_R.random_between(_,_+grdSprSz_R));return r}let triSz_R=28,sqrSz_R=40,cirSz_R=40;var msgN_R=!0,msgNarr_R=[];function createShape_R(e,_,r){let t;1==gl.tf?t=Math.round(R_R.random_between(3,6)):(t=Math.round(R_R.random_between(0,6)),msgNarr_R.push(t))}let clrs_R,c0_R,c1_R,c2_R,c3_R,c4_R,c5_R,c6_R;function pkClrs_R(e){c0=[0,1,2],c1=[3,4,5],c2=[6,7,8],c3=[9,10,11],c4=[12,13,14],c5=[15,16,17],c6=[18,19,20],clrs=[c0,c1,c2,c3,c4,c5,c6];var _=Math.round(R_R.random_between(0,2));return clrs[e][_]}var cP_R=Math.round(R_R.random_between(0,6));function drawLine_R(){for(let e=0;e<rectCoors_R.x.length;e++){let _=getPoints_R(rectCoors_R.x[e],rectCoors_R.y[e]);for(let e=0;e<_.x.length;e++);createShape_R(pkClrs_R(cP_R),_.x[0],_.y[0])}(getOccurrence_R(msgNarr_R,0)>=1||getOccurrence_R(msgNarr_R,1)>=1||getOccurrence_R(msgNarr_R,2)>=1)&&(msgN_R=!1)}var glClr_R=Math.round(R_R.random_between(0,2)),gl7_R=getOccurrence_R(decPairs_R,7);let vType_R=mapRange_R(decPairs_R[31],0,255,0,2);function setup_R(){if(gl7_R>=3)switch(glClr_R){case 0:case 1:case 2:gl.tf=!0}setGridType_R(vType_R),setHashTxt_R(mapRange_R(decPairs_R[30],0,255,0,13),vType_R),createGrid_R(),drawLine_R(),results_R(myHash_R)};function results_R(e){var _,r;_={gridSize:["2x2","4x4","8x8"],palette:["Playful","Growth","Calm","Naughty","Dark","Excited","Ambiguous","Neutral"],sPalette:["Love","Encrypted","Happy"]},r=1==msgN_R?7:cP_R,gl7_R>=3?features.push("Length: "+_.gridSize[vType_R],"Message: "+_.sPalette[glClr_R],"To: "+e):features.push("Length: "+_.gridSize[vType_R],"Message: "+_.palette[r],"To: "+e)}setup_R(vType_R);

featuresReduced.push(features[0]);
featuresReduced.push(features[1]);

}



  //////

else if (projectId===51){
  // sfc32 is a chaotic PRNG, the sfc stands for "Small Fast Counter".
  function sfc32(a, b, c, d) {
    return function() {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  // Call `prng()` to generate a pseudo-random number.
  let prng = new sfc32(
    parseInt(tokenData.substr(2, 8), 16),
    parseInt(tokenData.substr(10, 8), 16),
    parseInt(tokenData.substr(18, 8), 16),
    parseInt(tokenData.substr(27, 8), 16)
  );

  // returns a random integer from 0 to max, with a given PRNG.
  function rI(prng, max) {
    return parseInt(max * prng());
  }

  // turns an array of 3 0-255 RGB color values into a RGB color string.
  function rgbC(colorArray) {
    return "rgb(" +
      colorArray[0] + "," +
      colorArray[1] + "," +
      colorArray[2] +
      ")";
  }

  // turns 2 arrays of 3 0-255 RGB color values into a RGB color string,
  // given a specified blending ratio.
  function rgbCB(colorArrayA, colorArrayB, blendA, blendB) {
    return "rgb(" +
      parseInt(colorArrayA[0] * blendA + colorArrayB[0] * blendB) + "," +
      parseInt(colorArrayA[1] * blendA + colorArrayB[1] * blendB) + "," +
      parseInt(colorArrayA[2] * blendA + colorArrayB[2] * blendB) +
      ")";
  }

  // Color palettes (9 different options).
  let palettes = [
    // Cool Summer (2x).
    [
      [209, 41, 66],
      [245, 221, 129],
      [75, 129, 184],
      [144, 184, 230]
    ],
    [
      [209, 41, 66],
      [245, 221, 129],
      [75, 129, 184],
      [144, 184, 230]
    ],
    // Autumn Breeze.
    [
      [62, 137, 137],
      [29, 45, 68],
      [232, 221, 181],
      [167, 117, 77]
    ],
    // Fallen Leaves.
    [
      [89, 83, 88],
      [168, 172, 61],
      [255, 236, 89],
      [252, 127, 49]
    ],
    // Preserves.
    [
      [158, 0, 89],
      [93, 127, 218],
      [182, 156, 211],
      [239, 121, 138]
    ],
    // Forest Stroll.
    [
      [218, 165, 136],
      [176, 208, 211],
      [163, 201, 168],
      [68, 99, 63]
    ],
    // Sunny Day.
    [
      [0, 50, 73],
      [98, 144, 195],
      [234, 225, 81],
      [240, 135, 0]
    ],
    // Sunglasses Required (2x).
    [
      [215, 65, 167],
      [6, 174, 213],
      [255, 252, 49],
      [247, 92, 3]
    ],
    [
      [215, 65, 167],
      [6, 174, 213],
      [255, 252, 49],
      [247, 92, 3]
    ]
  ];

  // Cool Summer (2x).
  let coolSummer = [
      [209, 41, 66],
      [245, 221, 129],
      [75, 129, 184],
      [144, 184, 230]
    ];
  // Autumn Breeze.
  let autumnBreeze = [
    [62, 137, 137],
    [29, 45, 68],
    [232, 221, 181],
    [167, 117, 77]
  ];
  // Fallen Leaves.
  let fallenLeaves = [
    [89, 83, 88],
    [168, 172, 61],
    [255, 236, 89],
    [252, 127, 49]
  ];
  // Preserves.
  let preserves = [
    [158, 0, 89],
    [93, 127, 218],
    [182, 156, 211],
    [239, 121, 138]
  ];
  // Forest Stroll.
  let forestStroll = [
    [218, 165, 136],
    [176, 208, 211],
    [163, 201, 168],
    [68, 99, 63]
  ];
  // Sunny Day.
  let sunnyDay = [
    [0, 50, 73],
    [98, 144, 195],
    [234, 225, 81],
    [240, 135, 0]
  ];
  // Sunglasses Required (2x).
  let sunglassesRequired = [
    [215, 65, 167],
    [6, 174, 213],
    [255, 252, 49],
    [247, 92, 3]
  ];

  function getPaletteName(pal) {
    if (JSON.stringify(pal) === JSON.stringify(coolSummer)) {
      return "Cool Summer";
    }
    if (JSON.stringify(pal) === JSON.stringify(autumnBreeze)) {
      return "Autumn Breeze";
    }
    if (JSON.stringify(pal) === JSON.stringify(fallenLeaves)) {
      return "Fallen Leaves";
    }
    if (JSON.stringify(pal) === JSON.stringify(preserves)) {
      return "Preserves";
    }
    if (JSON.stringify(pal) === JSON.stringify(forestStroll)) {
      return "Forest Stroll";
    }
    if (JSON.stringify(pal) === JSON.stringify(sunnyDay)) {
      return "Sunny Day";
    }
    if (JSON.stringify(pal) === JSON.stringify(sunglassesRequired)) {
      return "Sunglasses Required";
    }
    return "Unknown";
  }

  // Params to use for building the sunset.
  //
  // These two ratios *not* adding up to 1 makes the reflection darker
  // and adding up to greater than 1 makes the reflection lighter.
  let s_CR = 0.75;
  let w_CR = 0.25;
  let s_R = 1 / 650;

  function getFeatures() {
    let paletteA = palettes.splice(rI(prng, 9), 1)[0];
    let plaetteAName = getPaletteName(paletteA);
    let sunColorsA = paletteA.splice(rI(prng, 4), 1)[0];
    let skyColorsA = paletteA.splice(rI(prng, 3), 1)[0];
    let waterColorsA = paletteA.splice(rI(prng, 2), 1)[0];
    let paletteB = palettes.splice(rI(prng, 8), 1)[0];
    let plaetteBName = getPaletteName(paletteB);
    let sunColorsB = paletteB.splice(rI(prng, 4), 1)[0];
    let skyColorsB = paletteB.splice(rI(prng, 3), 1)[0];
    let waterColorsB = paletteB.splice(rI(prng, 2), 1)[0];

    let featureParams = {
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // Fixed Params (fixed across potential double exposures) //
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////

      // whether or not to leave the sun empty
      e_S: rI(prng, 90) == 0,
      // whether or not to display an aura around the sun
      s_A: rI(prng, 12) == 0,
      // side-by-side "double exposure"
      s_BSE: rI(prng, 18) == 0,
      // shift (if any) to apply, moving the side-by-side split left/right
      // 0 == no shift, even == left shift, odd == right shift
      // (for variant A in double exposures)
      s_BSS: rI(prng, 5),
      // whether or not to A/B color-blend
      c_B: rI(prng, 18) == 0,
      // whether A/B color-blend should use glyph homage
      g_H: rI(prng, 2) == 0,

      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // Variable Params (per-exposure specific, if applicable) //
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////
      // For variant A in double exposures. //////////////////////
      ////////////////////////////////////////////////////////////
      // color of the sky
      sk_CA: rgbC(skyColorsA),
      // color of the sun
      su_CA: rgbC(sunColorsA),
      // color of the water
      wa_CA: rgbC(waterColorsA),
      // color of the sun reflection on the water
      rf_CA: rgbCB(sunColorsA, waterColorsA, s_CR, w_CR),
      // color of the aura reflection on the water
      au_CA: rgbCB(waterColorsA, sunColorsA, w_CR, s_CR),
      // shift (if any) to apply, moving the sun left/right
      // 0 == no shift, even == left shift, odd == right shift
      su_SA: rI(prng, 5),
      su_SVA: rI(prng, 2) + 2,
      // shift (if any) to apply, moving the horizon up/down
      // 0 == no shift, even == up shift, odd == down shift
      hz_SA: rI(prng, 5),
      // whether or not to stipple-blend the reflections
      st_TA: rI(prng, 12) == 0,
      // relative size of the stippling brush (an integer value)
      st_SA: rI(prng, 4) + 3,
      // relative density of the stippling strokes
      st_DA: rI(prng, 2) + 1,

      ////////////////////////////////////////////////////////////
      // For variant B in double exposures. //////////////////////
      ////////////////////////////////////////////////////////////
      // color of the sky
      sk_CB: rgbC(skyColorsB),
      // color of the sun
      su_CB: rgbC(sunColorsB),
      // color of the water
      wa_CB: rgbC(waterColorsB),
      // color of the sun reflection on the water
      rf_CB: rgbCB(sunColorsB, waterColorsB, s_CR, w_CR),
      // color of the aura reflection on the water
      au_CB: rgbCB(waterColorsB, sunColorsB, w_CR, s_CR),
      // shift (if any) to apply, moving the sun left/right
      // 0 == no shift, even == left shift, odd == right shift
      su_SB: rI(prng, 5),
      su_SVB: rI(prng, 2) + 2,
      // shift (if any) to apply, moving the horizon up/down
      // 0 == no shift, even == up shift, odd == down shift
      hz_SB: rI(prng, 5),
      // whether or not to stipple-blend the reflections
      st_TB: rI(prng, 12) == 0,
      // relative size of the stippling brush (an integer value)
      st_SB: rI(prng, 4) + 3,
      // relative density of the stippling strokes
      st_DB: rI(prng, 2) + 1
    };

    var features = [];
    if (featureParams.e_S) {
      features.push(`Forgotten Sun: true`);
    }
    if (featureParams.s_A) {
      features.push(`Sun Aura: true`);
    }
    if (featureParams.s_BSE) {
      features.push(`Double Print: true`);
    }
    if (featureParams.c_B) {
      let colorSpliceType = featureParams.g_H ? "Homage" : "Blended";
      features.push(`Color Splice: ${colorSpliceType}`)
    }

    if (featureParams.s_BSE) {
      features.push(`Stipple Size A-Side: ${featureParams.st_SA}`);
      features.push(`Stipple Size B-Side: ${featureParams.st_SB}`);

      features.push(`Stipple Density A-Side: ${featureParams.st_DA}`);
      features.push(`Stipple Density B-Side: ${featureParams.st_DB}`);

      features.push(`Color Palette A-Side: ${plaetteAName}`);
      features.push(`Color Palette B-Side: ${plaetteBName}`);

      if (featureParams.st_TA) {
        features.push(`Blended Reflections A-Side: true`);
      }
      if (featureParams.st_TB) {
        features.push(`Blended Reflections B-Side: true`);
      }

      let verticalAlignmentA;
      if (featureParams.hz_SA == 0) {
        verticalAlignmentA = "Center";
      } else if (featureParams.hz_SA % 2 == 0) {
        verticalAlignmentA = "Top";
      } else {
        verticalAlignmentA = "Bottom";
      }
      let horizontalAlignmentA;
      if (featureParams.su_SA == 0) {
        horizontalAlignmentA = "Center";
      } else if (featureParams.su_SA % 2 == 0) {
        horizontalAlignmentA = "Left";
      } else {
        horizontalAlignmentA = "Right";
      }
      let alignmentA;
      if (verticalAlignmentA == "Center" && horizontalAlignmentA == "Center") {
        alignmentA = "Perfect Balance";
      } else {
        alignmentA = `${verticalAlignmentA}-${horizontalAlignmentA}`;
      }
      features.push(`Alignment A-Side: ${alignmentA}`);

      let verticalAlignmentB;
      if (featureParams.hz_SB == 0) {
        verticalAlignmentB = "Center";
      } else if (featureParams.hz_SB % 2 == 0) {
        verticalAlignmentB = "Top";
      } else {
        verticalAlignmentB= "Bottom";
      }
      let horizontalAlignmentB;
      if (featureParams.su_SB == 0) {
        horizontalAlignmentB = "Center";
      } else if (featureParams.su_SB % 2 == 0) {
        horizontalAlignmentB = "Left";
      } else {
        horizontalAlignmentB = "Right";
      }
      let alignmentB;
      if (verticalAlignmentB == "Center" && horizontalAlignmentB == "Center") {
        alignmentB = "Perfect Balance";
      } else {
        alignmentB = `${verticalAlignmentB}-${horizontalAlignmentB}`;
      }
      features.push(`Alignment B-Side: ${alignmentB}`);
    } else {
      features.push(`Stipple Size: ${featureParams.st_SA}`);
      features.push(`Stipple Density: ${featureParams.st_DA}`);
      features.push(`Color Palette: ${plaetteAName}`);

      if (featureParams.st_TA) {
        features.push(`Blended Reflections: true`);
      }

      let verticalAlignment;
      if (featureParams.hz_SA == 0) {
        verticalAlignment = "Center";
      } else if (featureParams.hz_SA % 2 == 0) {
        verticalAlignment = "Top";
      } else {
        verticalAlignment = "Bottom";
      }
      let horizontalAlignment;
      if (featureParams.su_SA == 0) {
        horizontalAlignment = "Center";
      } else if (featureParams.su_SA % 2 == 0) {
        horizontalAlignment = "Left";
      } else {
        horizontalAlignment = "Right";
      }
      let alignment;
      if (verticalAlignment == "Center" && horizontalAlignment == "Center") {
        alignment = "Perfect Balance";
      } else {
        alignment = `${verticalAlignment}-${horizontalAlignment}`;
      }
      features.push(`Alignment: ${alignment}`);
    }

    return features;
  }

  features = getFeatures();
  featuresReduced=features;

}
/////////////////////////

else if (projectId===53){
  (()=>{"use strict";function e(e){var f=o(~~e[0],0,255),t=o(~~e[1],0,255);return"#"+(o(~~e[2],0,255)|t<<8|f<<16|16777216).toString(16).slice(1)}function f(f,t,a){var c=Math.sin,r=Math.cos;const n=a/180*s;return e((([e,f,t])=>{let a=d(e+.3963377774*f+.2158037573*t,3),c=d(e-.1055613458*f-.0638541728*t,3),r=d(e-.0894841775*f-1.291485548*t,3);return[o(~~(255*p(4.0767245293*a-3.3072168827*c+.2307590544*r)),0,255),o(~~(255*p(-1.2681437731*a+2.6093323231*c-.341134429*r)),0,255),o(~~(255*p(-.0041119885*a-.7034763098*c+1.7068625689*r)),0,255)]})([f/=100,(t/=100)?t*r(n):0,t?t*c(n):0]))}function t(e,f){return 0>f?"Procedural":e?["Campgrounds","Bauhaus","Pop","Disco","Midnight","Holographic","Spring","Siren","PeachPlum","BloodOrange","Highlighter","Chalk"][f]:["Ballpoint","Memphis","Lime","Acid","Peppermint"][f]}function a(e){return 0===e?"Minimal":1===e?"Invert":2===e?"Screenprint":3===e?"Lino":6===e?"Acrylic":7===e?"Pencil":8===e?"Metallic":15===e?"Starfall":9===e?"Drift":12===e?"Warhol":13===e?"Riso":14===e?"Neon":"Unknown"}var c=Math.floor,r=Math.max,n=Math.min,s=Math.PI,d=Math.pow;const o=(e,f,t)=>r(n(e,t),f),i=e=>d((e+.055)/1.055,2.4),l=(f,t=~~(f/100*255))=>e([t,t,t]),b=e=>{"string"==typeof e&&(e=u(e));var f=e[0]/255,t=e[1]/255,a=e[2]/255;return.2126*(.03928>=f?f*(1/12.92):i(f))+.7152*(.03928>=t?t*(1/12.92):i(t))+.0722*(.03928>=a?a*(1/12.92):i(a))},h=(e,f)=>{var t=b(e),a=b(f);return(r(t,a)+.05)/(n(t,a)+.05)},u=e=>{var f=e.replace("#",""),t=parseInt(f,16);return[t>>16,255&t>>8,255&t]},p=e=>.0031308<e?1.055*d(e,1/2.4)-.055:12.92*e,g=(e,f,t=1,a=[3,2.5,2])=>{for(let c=0;c<a.length;c++){const r=e.filter(e=>f.every(f=>h(e,f)>=a[c]));if(r.length>=t)return r}},m=d(2,-32),v=32557,M=new Uint16Array(4),y=new DataView(M.buffer),S=()=>{const e=M[0],f=M[1],t=M[2],a=M[3],c=0|33103+v*e,r=0|63335+v*f+(19605*e+(c>>>16)),n=0|31614+v*t+19605*f+(62509*e+(r>>>16));M[0]=c,M[1]=r,M[2]=n,M[3]=5125+v*a+(19605*t+62509*f)+(22609*e+(n>>>16));const s=(a<<21)+((a>>2^t)<<5)+((t>>2^f)>>11);return m*((s>>>(a>>11)|s<<(31&-(a>>11)))>>>0)},w=(e,f=0)=>{const t=16;for(var a,c=1540483477,r=e.length,n=f^r,s=0;4<=r;)a=(65535&(a=255&e[s]|(255&e[++s])<<8|(255&e[++s])<<16|(255&e[++s])<<24))*c+(((a>>>t)*c&65535)<<t),n=(65535&n)*c+(((n>>>t)*c&65535)<<t)^(a=(65535&(a^=a>>>24))*c+(((a>>>t)*c&65535)<<t)),r-=4,++s;switch(r){case 3:n^=(255&e[s+2])<<t;case 2:n^=(255&e[s+1])<<8;case 1:n=(65535&(n^=255&e[s]))*c+(((n>>>t)*c&65535)<<t)}return n=(65535&(n^=n>>>13))*c+(((n>>>16)*c&65535)<<16),(n^=n>>>15)>>>0},P=()=>.5<S(),D=(e=.5)=>S()<e,k=(e,f)=>(void 0===f&&(f=e,e=0),S()*(f-e)+e),U=(e,f)=>c(k(e,f)),A=e=>e.length?e[U(e.length)]:void 0,B=e=>{for(var f,t,a=e.length,c=[...e];a;)f=~~(S()*a--),t=c[a],c[a]=c[f],c[f]=t;return c},L="#000000",C=e=>e.match(/.{6}/g).map(e=>"#"+e),E=e=>e.split`:`.map(C),I=C("f2c5d2e5bb579c96cdf5eeeb76b99570a7c5f8e6d1dfbcabf1e7e1efedf6e1dce9f0ded5cdcad5f2f2f2"),R=C("914e720078bf00a95c3255a4f150603d5588765ba700838abb8b41407060ff665e925f52ffe800d2515eff6c2fff48b0ac936ee45d50ff747762a8e54982cf0074a2235ba8484d7a435060d5e4c0a5aaa870747c5f8289375e775e695e00aa9319975d397e58516e5a4a635d68724d62c2b167b346009da5169b62237e742f61659d7ad2aa60bf775d7a6c5d80f65058d1517a9e4c6ea75154e3ed55ffb511ffae3bf6a04dee7f4bff6f4cba8032bd64398e595af2cdcff984cae6b5c9bd8ca682d8d5ffe900ff4c65"),j=E("455097db6a4568876bf5be2f:224816e85d13f5b2bc90c6cbf9b807:fc4626fddc3f0971d900bb70:ff5500f4c1451447142f04fce276af:21a48ff9ced08ab2dfef7a62"),H=E("344e49ebb133f7ebd0f9e9d3f8ead3a28a7d:224816e85d13f5b2bc90c6cbf9b807fcfdfe:272b239de6d7d4dd38e1e2db29b09de17072:290915f7ac32e8cec59c1debe37440eb8ae1:180d0643372fa79f98f66257d3978f0c4b37:222518ca684301853f4b97c206783b00833f:144714c58e46455097db6a4558765b:312fc882fcfcfbaff5d551ee1c1d67d85598:5f3746808cc5f293823c757e:282634bd928ba1a6aade7571ff4e44:3a3d7e6aaadefddf48:455097ffffffdb6a4568876bf5be2f"),O=[[0,50],[1,15],[2,50],[3,30],[7,160],[12,80],[6,160],[13,50],[14,50],[8,25],[9,25]],W=new Set;R.forEach((e,f)=>{R.forEach((t,a)=>{if(f!=a&&3<=h(e,t)){const e=[f,a];e.sort((e,f)=>e-f),W.add(e.join(":"))}})});const q=[...W].map(e=>e.split(":").map(e=>R[e]));(()=>{let c="undefined"!=typeof tokenData&&("string"==typeof tokenData?tokenData:tokenData.hash);if(c){const r=((c,r=42)=>{(e=>{const f=~~((e.length-2)/2),t=[];for(let a=0;a<f;a++){const f=2+2*a;t.push(parseInt(e.slice(f,f+2),16))}const a=w(t,1690382925),c=w(t,72970470);y.setUint32(0,a),y.setUint32(4,c)})(c),(e=>{const f=Math.sqrt(3);var t=(3-f)/6,a=[..."221021201001212012210010122102120100"].map(e=>e-1),c=0;const r=new Uint8Array(512);for(var n=r.slice(0,256);256>c;c++)n[c]=c;for(c=0;255>c;c++){var s=c+~~(e()*(256-c)),d=n[c];n[c]=n[s],n[s]=d}const o=r.slice();for(c=0;512>c;c++)r[c]=n[255&c],o[c]=r[c]%12})(S);let n=D(.01),d=!n&&D(.25),[o,i,b,h,p,m,v,M,C]=((t,a)=>{const c=a?15:O[(e=>{var f,t=0;for(f=0;f<e.length;f++)t+=e[f];var a=S()*t;for(f=0;f<e.length;f++){if(a<e[f])return f;a-=e[f]}return 0})(O.map(e=>e[1]))][0];let r,n,s=0,d=L,o="source-over",i=1,b=-1;const h=8==c;if(0==c)r=l(98),n=[l(5)];else if(1==c)r=l(5),n=[l(98)];else if(15===c)r=L,n=["#ffea00","#878787","#ffffff"];else if(9==c)r=L,n=["#ffffff"],s=0,i=.25,o="screen";else if(2==c||3==c){const e=2==c;r=e?f(50,k(5,20),k(360)):f(92,k(5,5),k(360)),n=[e?"#ffffff":L]}else if(12===c)r=(n=[...(()=>B(A(q)))()]).shift();else if(7==c)r=l(95),b=U(j.length),n=[...j[b]],o="multiply",s=.25,d="#ffffff";else if(13==c||14==c)r=(n=[...(e=>{const t=14==c?f(30,A([2,5,10]),k(100,300)):A(I),a=[t,A(g(R,[t],2)||[L])];let r=g(R,a);return P()&&r&&a.push(A(r.filter(e=>!a.includes(e)))),a})()]).shift();else if(6==c)b=U(H.length),r=(n=[...H[b]]).shift();else if(h){const e=A(g(R,[r=L],2.5,[5,4,3]));n=[L,l(40),e]}const p="source-over"===o;let m=p?1:i,v=d,M=p?0:s;if(!h&&15!=c&&(n=B(n),t)){const e=g(n,[r]);e&&(n=e)}return 0<M&&(n=n.map(f=>((f,t,a)=>{f=u(f),t=u(t);for(var c=0;3>c;c++)t[c]=t[c]*a+f[c]*(1-a);return e(t)})(f,v,M))),[n,r,m,o,"source-over"==o,h,9==c,c,b]})(d,n);o.map(e=>u(e)),A([[.5,.5],[1,.25],[.5,0],[0,1]]);let E=D(.1);d||A([4,5,6]);let W=D(.05);P();const x=!W&&D(.075),G=D(.2)&&x;P(),G||W||k(.02,.25),x||D(.1),!P()&&A([0,s/2]);let N=!v&&!m&&D(.1),T=n||m||2<=o.length&&D(.3);const V=!n&&!m&&D(.1);V&&U(10,21),P();let $=[[0,1,1,4.5,1],[0,.5,1,5,1.75],[0,.75,1,4,1],[0,1,.5,3,2]];W||m||!D(1)||$.push([0,.75,1,7.5,1],[0,.5,.75,5,4],[0,.5,.75,4,3]),G||W||m||!D(.25)||$.push([1,.4,.5,.5,1],[1,.2,1,1,1],[1,.4,1,1,1],[1,.25,.85,2,2]),W&&($=[[0,.5,1,2,2]]);let[z,F,J,K,Q]=A($),X=!x&&!V&&p&&!m&&!d&&D(.05),Y=!V&&!N&&!v&&!("multiply"==h)&&D(.33),Z=[N?.33:.15];N?Z.push(.5,.7):Y?Z.push(.5,1.1):Z.push(...A([[.66],[.5],[.33,.7],[.25,.5,.75]])),A([2,5,10,15]),N||P(),G||v||!(m||W||D(.1))||(m?o[2]:o[0]);const _=!x&&p&&!N&&!v&&!W&&!X&&!V&&D(.1);let ee;d?ee=[[.0125],[.01]]:(ee=[[.0085,.01],[.0125,.0085],[.015,.01,.0085]],!N&&ee.push([.01])),A(ee),k(-10,10),k(-10,10);{let e=!1;return d||(N?2<=o.length&&!T&&(e=!0):e=!0),((e={})=>()=>e)({Style:a(M),Palette:t(p,C),River:_,Stippled:N,Brushed:Y,Wireframe:X,Lattice:V,Blended:T&&!m,Patchwork:e,Grid:E,Landscape:W?"Summit":x?G?"Waterfall":"Coast":["Mountains","Hills"][z]})}})(c)();Object.entries(r).forEach(([e,f])=>{const t=[e,(f+"").charAt(0).toUpperCase()+(f+"").slice(1)].join(": ");features.push(t),featuresReduced.push(t)})}})()})();
}

////////

else if (projectId===54){

}

else if (projectId===55){
  (function calcFeatures () {

    // extracted p5 funcs
    const pfuncs = {
      constrain: (n, low, high) => {
        return Math.max(Math.min(n, high), low);
      },
      remap: (n, start1, stop1, start2, stop2, withinBounds) => {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
          return newval;
        }
        if (start2 < stop2) {
          return pfuncs.constrain(newval, start2, stop2);
        } else {
          return pfuncs.constrain(newval, stop2, start2);
        }
      }
    }

    const calcDecPairs = () => {
      // assumes tokenData is set globally
      hashPairs = [];
      for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)));
      }
      // Parse the hash pairs into ints. Hash pairs are base 16 so "ec" becomes 236.
      // Each pair will become a value ranging from 0 - 255
      const decPairs = hashPairs.map(x => {
        return parseInt(x, 16);
      });
      return decPairs
    }

    const dcp = calcDecPairs()
    const opts = {}
    const traits = []

    const baseConfig = {
      shardSteps: 8,
      shardWidth: 3,     // how much shards overlap / gaps
    }

    opts.initAngle = pfuncs.remap(dcp[0], 0, 256, 0, 100)
    opts.stepAngle = (2 * Math.PI) / baseConfig.shardSteps

    opts.hueRange = pfuncs.remap(dcp[5], 0, 256, 50, 200)
    opts.startHue = pfuncs.remap(dcp[10], 0, 256, 0, 80) // not close to the end
    const hue = opts.startHue
    opts.endHue = (hue + opts.hueRange) // might be more than 360
    opts.hueStep = opts.hueRange / dcp.length

    const startGlitch = pfuncs.remap(dcp[10], 0, 256, 0, 100)
    opts.glitch = (startGlitch < 5)

    for (const [key, value] of Object.entries(opts)) {
      const v = Math.round(value)
      traits.push(`${key}: ${v}`)
    }

    features = traits // overwrite globals
    featuresReduced = traits;
    console.log('set features:', features)
  })()

}




//////

else if (projectId===56){

  const auroraIVFeatures = (hash) => {
  	const features = [];
  	const RandomGenerator = function (s) {
  		let seedA = s;
  		return function () {
  			seedA ^= seedA << 13;
  			seedA ^= seedA >> 17;
  			seedA ^= seedA << 5;
  			return ((seedA < 0 ? ~seedA + 1 : seedA) % 1000) / 1000;
  		};
  	};
  	const random = RandomGenerator(parseInt(tokenData.slice(0, 16), 16));
  	const randpos = (a) => {
  		return a[Math.floor(random() * a.length)];
  	}
  	random();
  	random();
  	const day = random() > 0.15 ? 1 : 0;
  	const model = randpos([1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4]);
  	random();
  	let hue = "hue " + randpos([0,15,15,15,15,15,15,100,200,220,250,300]);
  	const inchue = random() >= 0.98 ? 0.02 : 0;
  	const sr = random() > 0.95 ? 0.05 : -0.05;
  	const bw = (day && random() > 0.98) ? 1 : 0;
  	const sp = (day && random() > 0.98) ? 1 : 0;
  	features.push("mode:" + ['night','day'][day]);
  	features.push("model:" + ["megalopolis","city","station","outpost"][model-1]);
  	if (bw || sp) {
  		if (bw) hue = "black and white";
  		if (sp) hue = "sepia";
  	} else {
  		if (inchue > 0) hue = "multicolors";
  	}
  	features.push("color:" + hue);
  	features.push("rotation:" + (sr > 0 ? "counter-clockwise" : "clockwise"));
  	return features;
  };


  /////////////////////////////////////////////////////////////////////


  features = auroraIVFeatures(tokenData);
  featuresReduced=features;
  console.log(features)
}



/////////

else if (projectId === 57) {

	let hashPairs = [];
	for (let i = 0; i < 32; i++) {
		let hex = tokenData.slice((2 * i) + 2, (2 * i) + 4);
		hashPairs[i] = parseInt(hex, 16);
	}
	let seed = parseInt(tokenData.slice(30, 46), 16);
	let r, orientation, w;
	let order = [];
	let single, bw, transparency, outlines, anglelock, nonudge, darkmode, rev, linear = false;
	let g = 0;
	r = Math.floor(hashPairs[31].map(0, 255, 6, 12.9999999999));
	if (hashPairs[0] == 2 || hashPairs[0] == 20 || hashPairs[0] == 200) {
		r = 20;
	}
	w = ((Math.floor(hashPairs[1].map(0, 255, 0, 5.9999999999))) * .25) + .25;
	orientation = Math.floor(hashPairs[30].map( 0, 255, 0, 1.9999999999));
	if (hashPairs[29] > 224) {
		anglelock = true;
		rnd();
	}
	if (hashPairs[28] > 192) {
		nonudge = true;
	}
	if (hashPairs[27] < 112) {
		darkmode = true;
	}
	if (hashPairs[26] < 128 && (w > .75 && !anglelock) && !darkmode) {
		transparency = true;
	}
	if (hashPairs[26] > 224) {
		outlines = true;
	}
	if (hashPairs[25] < 36 && (w < 1.25 || transparency || outlines)) {
		single = true;
	}
	if (hashPairs[25] > 232 && (w < 1.25 || transparency || outlines)) {
		bw = true;
	}

	for (let i = 1; i < r + 1; i++) {
		order.push(i);
	}

	if (hashPairs[24] > 224) {
		rev = true;
		order = order.reverse();
	} else if (hashPairs[24] < 64 || w > .75 && !transparency && !outlines && !single && !bw) {
		linear = true;
	} else {
		order = scramble(order);
	}
	for (let i = 0; i < r; i++) {
		rnd();
		rnd();
		if (Math.floor(rnd().map( 0, 1, 0, 255)) < 1 && order[i] != 1 && order[i] != r) {
			g++;
		}
	}

	if (darkmode) {
		features.push('Mode: Dark');
	} else {
		features.push('Mode: Light');
	}
	features.push('Bars: ' + (r - g));
	features.push('Gaps: ' + g);
	features.push('Width: ' + Math.floor(100 * w) + '%');
	if (orientation == 0) {
		features.push('Orientation: Vertical');
	}
	if (orientation == 1) {
		features.push('Orientation: Horizontal');
	}
	if (anglelock && (w < 1.25 || transparency)) {
		features.push('Rotation: Locked');
	} else {
		features.push('Rotation: Variable');
	}
	if (nonudge) {
		features.push('Bounce: No');
	} else {
		features.push('Bounce: Yes');
	}
	if (single) {
		features.push('Color: Single');
	} else if (bw) {
		features.push('Color: Black & White');
	} else {
		features.push('Color: Sequence');
	}
	if (rev) {
		features.push('Arrangement: Reverse');
	} else if (linear) {
		features.push('Arrangement: Linear');
	} else {
		features.push('Arrangement: Shuffle');
	}
	if (transparency) {
		features.push('Style: Transparent');
	} else if (outlines) {
		features.push('Style: Outlines');
	} else {
		features.push('Style: Solid');
	}


function scramble(arr) {
	let newarr = [];
	let length = arr.length;
	for (let i = 0; i < length; i++) {
		let choice = Math.floor(rnd().map(0, 1, 0, arr.length));
		newarr.push(arr[choice]);
		arr.splice(choice, 1);
	}
	return(newarr);
}

function rnd() {
	seed ^= seed << 13;
	seed ^= seed >> 17;
	seed ^= seed << 5;
	return (((seed < 0) ? ~seed + 1 : seed) % 1000) / 1000;
}
  featuresReduced=features;
}

  //////
else if (projectId===58){

let hashIndex = 0
let hashData;

var planets = 0;
var ufos = 0;
var ovals = 0;
var circles = 0;
var rectangles = 0;
var arcs = 0;
var triangles = 0;

function setup() {
  let seed = parseInt(tokenData.slice(0, 16), 16);
  let R = new Random(seed);
  let extraHash = [...Array(225)].map(() => parseInt(R.random_between(0,255)));
  hashData = setupParametersFromTokenData(tokenData).concat(extraHash);
  let bcolor = hashData[inc()];
  if (bcolor < 25) {
    feature = "background: Gold";
  } else if (bcolor < 50){
    feature = "background: Old Lace";
  } else if (bcolor < 75) {
    feature = "background: Goldenrod Yellow"
  } else if (bcolor < 100) {
    feature = "background: Light Pink"
  } else if (bcolor < 125) {
    feature = "background: Antique White"
  } else if (bcolor < 150) {
    feature = "background: Ghost White"
  } else if (bcolor < 170) {
    feature = "background: Black"
  } else if (bcolor < 195) {
    feature = "background: Lavender"
  } else if (bcolor < 218) {
    feature = "background: Papaya Whip";
  } else {
    feature = "background: White"
  }
  features.push(feature);
  featuresReduced.push(feature);
}
class Random {
  constructor(seed) {
    this.seed = seed
  }
  random_dec() {
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >> 17
    this.seed ^= this.seed << 5
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
  }
  random_between(a, b) {
    return a + (b - a) * this.random_dec()
  }
}


function draw() {

  for (var x = 0; x < 400; x = x + 110) {
    for (var y = 0; y < 400; y = y + 110) {
      let colorChoice = hashData[inc()];
      if ( colorChoice >= 170) {

        circles = circles + 1;
      } else {
        pickShape(hashData[inc()]);
      }
      if (colorChoice < 86) {
        circles = circles + 1;
      } else {
        pickShape(hashData[inc()]);
      }
      if (colorChoice < 170 && colorChoice >= 86) {
        circles = circles + 1;
      }
      pickShape(hashData[inc()]);
    }
  }
  features.push("Ovals: "+ ovals);
  features.push("Circles: " + circles)
  features.push("Arc: "+ arcs);
  features.push("Rectangles: "+ rectangles);
  features.push("Triangles: "+ triangles);
  features.push("Planets: "+ planets);
  featuresReduced.push("Planets: "+ planets);
  features.push("UFO: "+ ufos);
  featuresReduced.push("UFO: "+ ufos);
  console.log(features);
}
function pickShape(value) {
  let circleIndex = inc();
  if (value <= 51) { // circle or oval
    circles = circles + 1;
  } else if (value <= 102) {
    let circleTwo = inc();
    ovals = ovals + 1;
  } else if (value <= 154) {
    arcs = arcs + 1;
  } else if (value <= 208) {
    let one = rangeConv(hashData[inc()], 60);
    let two = rangeConv(hashData[inc()], 60);
    let three = rangeConv(hashData[inc()], 60);
    if (Math.abs(one - three) < 10) {
      three = three + 10;
    }
    let four = rangeConv(hashData[inc()], 60);
    if (Math.abs(two - four) < 10) {
      four = four + 10;
    }
    let five = rangeConv(hashData[inc()], 60);
    if (Math.abs(three - five) < 10) {
      five = five + 10;
    }
    let six = rangeConv(hashData[inc()], 60);
    if (Math.abs(four - six) < 10) {
      six = six + 10;
    }
    triangles = triangles + 1;
  } else {
    let height = rangeConv(hashData[inc()], 30)+ 10;
    let width = rangeConv(hashData[inc()], 30) + 10;
    rectangles = rectangles + 1;
  }
  if ((value-inc()) == 42) {
    // planet
    let planetX = (rangeConv(hashData[inc()], 30)-10);
    let planetY = (rangeConv(hashData[inc()], 30)-10);
    ovals = ovals + 1;

    if (value==119 || value==164 || value==95) {
      arcs = arcs + 1;
      ufos = ufos + 1;
    } else {
      circles = circles + 1;
      planets = planets + 1;
    }
  }
}
function rangeConv(value, conv) {
  return value * conv / 255;
}
function setupParametersFromTokenData(token) {
  let hashPairs = []
  //parse hash
  for (let j = 0; j < 32; j++) {
    hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)))
  }
  return hashPairs.map(x => {
    return parseInt(x, 16)
  })
}
function generateSeedFromTokenData(token) {
  return parseInt(tokenData.slice(0, 16), 16)
}
function inc() {
  return hashIndex = (hashIndex + 1) % hashData.length;
}

setup();
draw();

}




  //////


  return [features, featuresReduced];
};
