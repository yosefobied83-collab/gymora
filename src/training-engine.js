(()=>{
  const originalGeneratePlan = generatePlan;
  const T=(ar,en,groups,mode='standard')=>({title:{ar,en},groups,mode});

  const recoverySplits={
    chest:{
      2:[T('كامل الجسم A — أولوية صدر','Full Body A — Chest Priority',['chest','chest','back','legs','shoulders']),T('كامل الجسم B — صدر إضافي','Full Body B — Extra Chest',['legs','back','chest','chest','arms'])],
      3:[T('صدر A — دفع','Chest A — Push',['chest','chest','shoulders','arms']),T('أرجل + ظهر','Legs + Back',['legs','legs','back','arms']),T('صدر B — حجم','Chest B — Volume',['chest','chest','back','shoulders'])],
      4:[T('صدر A + ترايسبس','Chest A + Triceps',['chest','chest','arms','shoulders']),T('أرجل A','Lower A',['legs','legs']),T('ظهر + بايسبس','Back + Biceps',['back','back','arms']),T('صدر B + أكتاف','Chest B + Shoulders',['chest','chest','shoulders','arms'])],
      5:[T('صدر A — أساسي','Chest A — Primary',['chest','chest','shoulders','arms']),T('أرجل A','Lower A',['legs','legs']),T('ظهر + بايسبس','Back + Biceps',['back','back','arms']),T('أرجل B — خفيف','Lower B — Light',['legs','legs','arms'],'assistance'),T('صدر B — حجم','Chest B — Volume',['chest','chest','shoulders','arms'])],
      6:[T('صدر A','Chest A',['chest','chest','shoulders','arms']),T('ظهر A','Back A',['back','back','arms']),T('أرجل A','Legs A',['legs','legs']),T('صدر B','Chest B',['chest','chest','shoulders','arms']),T('ظهر B','Back B',['back','back','arms']),T('أرجل B','Legs B',['legs','legs'])]
    },
    back:{
      2:[T('كامل الجسم A — أولوية ظهر','Full Body A — Back Priority',['back','back','legs','chest','shoulders']),T('كامل الجسم B — ظهر إضافي','Full Body B — Extra Back',['legs','chest','back','back','arms'])],
      3:[T('ظهر A + بايسبس','Back A + Biceps',['back','back','arms']),T('أرجل + صدر','Legs + Chest',['legs','legs','chest','shoulders']),T('ظهر B — حجم','Back B — Volume',['back','back','chest','arms'])],
      4:[T('ظهر A + بايسبس','Back A + Biceps',['back','back','arms']),T('أرجل A','Lower A',['legs','legs']),T('صدر + أكتاف','Chest + Shoulders',['chest','chest','shoulders','arms']),T('ظهر B — حجم','Back B — Volume',['back','back','arms','shoulders'])],
      5:[T('ظهر A — أساسي','Back A — Primary',['back','back','arms']),T('أرجل A','Lower A',['legs','legs']),T('صدر + أكتاف','Chest + Shoulders',['chest','chest','shoulders','arms']),T('أرجل B — خفيف','Lower B — Light',['legs','legs','arms'],'assistance'),T('ظهر B — حجم','Back B — Volume',['back','back','arms','shoulders'])],
      6:[T('ظهر A','Back A',['back','back','arms']),T('صدر A','Chest A',['chest','chest','shoulders','arms']),T('أرجل A','Legs A',['legs','legs']),T('ظهر B','Back B',['back','back','arms']),T('صدر B','Chest B',['chest','shoulders','arms']),T('أرجل B','Legs B',['legs','legs'])]
    },
    legs:{
      2:[T('كامل الجسم A — أولوية أرجل','Full Body A — Leg Priority',['legs','legs','chest','back','shoulders']),T('كامل الجسم B — أرجل إضافية','Full Body B — Extra Legs',['legs','legs','back','chest','arms'])],
      3:[T('أرجل A — أمامية','Legs A — Quad Focus',['legs','legs','chest']),T('علوي كامل','Upper Body',['chest','back','shoulders','arms']),T('أرجل B — خلفية','Legs B — Posterior Focus',['legs','legs','back'])],
      4:[T('أرجل A','Legs A',['legs','legs']),T('علوي A','Upper A',['chest','back','shoulders','arms']),T('أرجل B','Legs B',['legs','legs']),T('علوي B','Upper B',['back','chest','shoulders','arms'])],
      5:[T('أرجل A — سكوات','Legs A — Squat',['legs','legs']),T('دفع','Push',['chest','shoulders','arms']),T('أرجل B — خلفية','Legs B — Posterior',['legs','legs']),T('سحب','Pull',['back','back','arms']),T('أرجل C — مساعدة','Legs C — Assistance',['legs','legs'],'assistance')],
      6:[T('أرجل A — سكوات','Legs A — Squat',['legs','legs']),T('دفع A','Push A',['chest','shoulders','arms']),T('سحب A','Pull A',['back','back','arms']),T('أرجل B — خلفية','Legs B — Posterior',['legs','legs']),T('دفع B','Push B',['chest','shoulders','arms']),T('سحب B','Pull B',['back','back','arms'])]
    },
    upper:{
      2:[T('كامل الجسم A — أولوية علوي','Full Body A — Upper Priority',['chest','back','shoulders','chest','legs']),T('كامل الجسم B — أولوية علوي','Full Body B — Upper Priority',['back','shoulders','arms','chest','legs'])],
      3:[T('علوي A — صدر + ظهر','Upper A — Chest + Back',['chest','back','shoulders','arms','chest']),T('سفلي','Lower Body',['legs','legs']),T('علوي B — ظهر + أكتاف','Upper B — Back + Shoulders',['back','chest','shoulders','arms','back'])],
      4:[T('علوي A — دفع','Upper A — Push',['chest','chest','shoulders','arms','chest']),T('سفلي A','Lower A',['legs','legs']),T('علوي B — سحب','Upper B — Pull',['back','back','arms','shoulders','back']),T('سفلي B + كور','Lower B + Core',['legs','legs','arms'],'assistance')],
      5:[T('علوي A — متوازن','Upper A — Balanced',['chest','back','shoulders','arms','chest']),T('سفلي A','Lower A',['legs','legs']),T('علوي B — دفع','Upper B — Push',['chest','chest','shoulders','arms']),T('سفلي B','Lower B',['legs','legs']),T('علوي C — سحب','Upper C — Pull',['back','back','arms','shoulders'])],
      6:[T('علوي A — دفع','Upper A — Push',['chest','chest','shoulders','arms']),T('سفلي A','Lower A',['legs','legs']),T('علوي B — سحب','Upper B — Pull',['back','back','arms','shoulders']),T('سفلي B','Lower B',['legs','legs']),T('علوي C — مختلط','Upper C — Mixed',['chest','back','shoulders','arms']),T('سفلي C — خفيف','Lower C — Light',['legs','legs','arms'],'assistance')]
    }
  };

  generatePlan=function(profile){
    const template=recoverySplits[profile.focus]?.[profile.days];
    if(!template) return originalGeneratePlan(profile);
    let count=getExerciseCount(profile);
    if(profile.goal==='bulk' && profile.duration>=45) count=Math.max(count,5);
    return template.map((entry,idx)=>{
      const groups=[...entry.groups];
      return {
        id:'w'+(idx+1),day:idx+1,title:{...entry.title},group:groups[0],groups,
        place:profile.place,duration:profile.duration,goal:profile.goal,
        programVersion:TRAINING_PROGRAM_VERSION,strategy:profile.goal,mode:entry.mode,
        finisher:getFinisher(profile,profile.place,idx),
        exercises:selectExercises(profile,profile.place,groups,count,idx,template.length,entry.mode)
      };
    });
  };

  const moreFoods=[
    {id:'turkey',cat:'protein',ar:'صدر حبش/ديك رومي',en:'Turkey breast',unitAr:'100غ',unitEn:'100g',kcal:135,p:29,c:0,f:1,tags:['meat']},
    {id:'leanbeef',cat:'protein',ar:'لحم بقري قليل الدهن',en:'Lean beef',unitAr:'100غ',unitEn:'100g',kcal:217,p:26,c:0,f:12,tags:['meat']},
    {id:'salmon',cat:'protein',ar:'سلمون',en:'Salmon',unitAr:'100غ',unitEn:'100g',kcal:208,p:20,c:0,f:13,tags:['fish']},
    {id:'sardines',cat:'protein',ar:'سردين',en:'Sardines',unitAr:'100غ',unitEn:'100g',kcal:208,p:25,c:0,f:11,tags:['fish']},
    {id:'cottagecheese',cat:'protein',ar:'جبنة قريش',en:'Cottage cheese',unitAr:'200غ',unitEn:'200g',kcal:160,p:24,c:8,f:4,tags:['dairy','vegetarian']},
    {id:'labneh',cat:'protein',ar:'لبنة',en:'Labneh',unitAr:'100غ',unitEn:'100g',kcal:150,p:9,c:7,f:10,tags:['dairy','vegetarian']},
    {id:'chickpeas',cat:'protein',ar:'حمص حب مطبوخ',en:'Cooked chickpeas',unitAr:'كوب',unitEn:'1 cup',kcal:269,p:14.5,c:45,f:4.2,tags:['vegan','vegetarian']},
    {id:'tofu',cat:'protein',ar:'توفو',en:'Tofu',unitAr:'150غ',unitEn:'150g',kcal:180,p:20,c:5,f:11,tags:['vegan','vegetarian']},
    {id:'bulgur',cat:'carb',ar:'برغل مطبوخ',en:'Cooked bulgur',unitAr:'كوب',unitEn:'1 cup',kcal:151,p:5.6,c:34,f:.4,tags:['vegan']},
    {id:'couscous',cat:'carb',ar:'كسكس مطبوخ',en:'Cooked couscous',unitAr:'كوب',unitEn:'1 cup',kcal:176,p:6,c:36,f:.3,tags:['vegan']},
    {id:'sweetpotato',cat:'carb',ar:'بطاطا حلوة',en:'Sweet potato',unitAr:'250غ',unitEn:'250g',kcal:215,p:4,c:50,f:.3,tags:['vegan']},
    {id:'pitabread',cat:'carb',ar:'خبز عربي',en:'Pita bread',unitAr:'رغيف متوسط',unitEn:'1 medium pita',kcal:165,p:5.5,c:33,f:1,tags:['vegan']},
    {id:'quinoa',cat:'carb',ar:'كينوا مطبوخة',en:'Cooked quinoa',unitAr:'كوب',unitEn:'1 cup',kcal:222,p:8,c:39,f:3.6,tags:['vegan']},
    {id:'corn',cat:'carb',ar:'ذرة',en:'Corn',unitAr:'كوب',unitEn:'1 cup',kcal:143,p:5,c:31,f:2,tags:['vegan']},
    {id:'honey',cat:'carb',ar:'عسل',en:'Honey',unitAr:'ملعقة كبيرة',unitEn:'1 tbsp',kcal:64,p:0,c:17,f:0,tags:['vegetarian']},
    {id:'tahini',cat:'fat',ar:'طحينة',en:'Tahini',unitAr:'2 ملعقة كبيرة',unitEn:'2 tbsp',kcal:178,p:5,c:6,f:16,tags:['vegan']},
    {id:'almonds',cat:'fat',ar:'لوز',en:'Almonds',unitAr:'30غ',unitEn:'30g',kcal:174,p:6.4,c:6,f:15,tags:['nuts','vegan']},
    {id:'walnuts',cat:'fat',ar:'جوز',en:'Walnuts',unitAr:'30غ',unitEn:'30g',kcal:196,p:4.5,c:4,f:19.5,tags:['nuts','vegan']},
    {id:'avocado',cat:'fat',ar:'أفوكادو',en:'Avocado',unitAr:'نصف حبة',unitEn:'1/2 fruit',kcal:120,p:1.5,c:6,f:11,tags:['vegan']},
    {id:'orange',cat:'produce',ar:'برتقال',en:'Orange',unitAr:'حبة',unitEn:'1 medium',kcal:62,p:1.2,c:15.4,f:.2,tags:['vegan']},
    {id:'grapes',cat:'produce',ar:'عنب',en:'Grapes',unitAr:'كوب',unitEn:'1 cup',kcal:104,p:1.1,c:27,f:.2,tags:['vegan']},
    {id:'berries',cat:'produce',ar:'توت',en:'Berries',unitAr:'كوب',unitEn:'1 cup',kcal:70,p:1,c:17,f:.5,tags:['vegan']},
    {id:'salad',cat:'produce',ar:'سلطة خيار وبندورة',en:'Cucumber & tomato salad',unitAr:'كوبان',unitEn:'2 cups',kcal:70,p:3,c:14,f:1,tags:['vegan']},
    {id:'carrots',cat:'produce',ar:'جزر',en:'Carrots',unitAr:'حبتان',unitEn:'2 medium',kcal:50,p:1,c:12,f:.3,tags:['vegan']},
    {id:'spinach',cat:'produce',ar:'سبانخ مطبوخة',en:'Cooked spinach',unitAr:'كوب',unitEn:'1 cup',kcal:41,p:5,c:7,f:.5,tags:['vegan']}
  ];
  if(typeof FOOD_DB!=='undefined'){
    const ids=new Set(FOOD_DB.map(x=>x.id));
    moreFoods.forEach(f=>{if(!ids.has(f.id)) FOOD_DB.push(f);});
  }

  try{
    const marker='gymora_recovery_foods_v4';
    if(state?.profile && localStorage.getItem(marker)!=='1'){
      state.plan=generatePlan(state.profile);
      localStorage.setItem(marker,'1');
      saveState();
      renderAll();
    }
  }catch(e){console.warn('GYMORA recovery update',e);}
})();
