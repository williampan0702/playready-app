(function(){
const SPORT_LABELS={running:"Running",strength:"Strength training",cycling:"Cycling",general:"General fitness"};
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const round5=value=>Math.max(5,Math.round(value/5)*5);

function levelWord(value){return value>=5?"Very high":value>=4?"High":value>=3?"Moderate":"Mild";}

function calculateReadiness(data){
  let score=100;
  const factors=[];
  const breakdown=[];
  const addPenalty=(key,label,points,max)=>{score-=points;breakdown.push({key,label,points,max});if(points>0)factors.push({key,label,points:-points});};

  let sleepPenalty=data.sleep<5?30:data.sleep<6?22:data.sleep<7?12:0;
  addPenalty("sleep",sleepPenalty?`${data.sleep} hours of sleep`:"Sleep is in a supportive range",sleepPenalty,30);
  addPenalty("fatigue",`${levelWord(data.fatigue)} fatigue`,(data.fatigue-1)*7,28);
  addPenalty("soreness",`${levelWord(data.soreness)} muscle soreness`,(data.soreness-1)*6,24);
  addPenalty("stress",`${levelWord(data.stress)} stress`,(data.stress-1)*4,16);
  addPenalty("load",data.trainedHardYesterday?"Hard training session yesterday":"No hard session reported yesterday",data.trainedHardYesterday?8:0,8);

  score=clamp(Math.round(score),0,100);
  const calculatedLevel=score>=80?"ready":score>=60?"moderate":score>=40?"low":"recovery";
  const safety=Boolean(data.concerningSymptoms);
  const level=safety?"safety":calculatedLevel;
  if(safety)factors.unshift({key:"safety",label:"Pain, illness, dizziness, or concerning symptoms reported",points:0});
  return {score,level,calculatedLevel,safety,breakdown,factors:factors.length?factors:[{key:"clear",label:"No major limiting factors reported",points:0}]};
}

const COPY={
  ready:{label:"Ready",headline:"You're ready to train",summary:"Your reported recovery signals support a normal or moderately challenging session today.",note:"Keep the effort controlled early, then build if your body continues to feel good."},
  moderate:{label:"Moderate",headline:"Train, with some restraint",summary:"You can train today, but reducing volume or intensity will make the session better match your recovery.",note:"Keep most of the session conversational and avoid turning the final block into a max effort."},
  low:{label:"Low readiness",headline:"Make today a lighter day",summary:"Several recovery signals suggest replacing hard work with easy movement and technique-focused training.",note:"Easy should feel genuinely easy. Stop if soreness becomes pain or your energy continues to fall."},
  recovery:{label:"Recovery",headline:"Recovery is the training today",summary:"Your check-in points toward rest or very light movement instead of a structured high-effort workout.",note:"Choose gentle movement only if it helps you feel better. Prioritize food, hydration, and sleep."},
  safety:{label:"Pause",headline:"Training guidance paused",summary:"You reported a concerning symptom. Skip the generated workout and consider appropriate professional medical advice.",note:"Do not use a readiness score to override pain, illness, dizziness, or other warning signs."}
};

const ACTIVITY={
  running:{warm:"Dynamic running warm-up",main:{ready:"Comfortable run with 4-6 short pickups",moderate:"Easy conversational run",low:"Walk-jog at relaxed effort",recovery:"Gentle walk"},cool:"Walk and lower-body mobility"},
  strength:{warm:"Mobility and light activation",main:{ready:"Main lifts at a controlled challenging effort",moderate:"Technique work with lighter loads",low:"Mobility and light full-body circuit",recovery:"Gentle mobility"},cool:"Easy mobility and breathing"},
  cycling:{warm:"Easy spin and cadence build",main:{ready:"Steady ride with short tempo efforts",moderate:"Easy aerobic ride",low:"Very easy recovery spin",recovery:"Gentle walk or optional easy spin"},cool:"Easy spin and hip mobility"},
  general:{warm:"Dynamic full-body warm-up",main:{ready:"Balanced cardio and strength circuit",moderate:"Low-impact conditioning circuit",low:"Mobility and easy bodyweight movement",recovery:"Gentle mobility or walk"},cool:"Stretching and relaxed breathing"}
};

function makePlan(data,result,options={}){
  if(result.safety)return{id:"safety",title:"Safety pause",badge:"Do not train",total:0,intensity:"Paused",segments:[],note:COPY.safety.note};
  const activity=ACTIVITY[data.sport]||ACTIVITY.general;
  const level=options.level||result.calculatedLevel;
  const total=clamp(round5(options.minutes||data.minutes),15,180);
  const recovery=level==="recovery";
  const targetEffort={ready:6,moderate:5,low:3,recovery:2}[level];
  const warm=round5(total*(recovery?.25:.2));
  const cool=round5(total*(recovery?.25:.2));
  const main=Math.max(5,total-warm-cool);
  const warmTitle=recovery?"Gentle mobility and relaxed breathing":activity.warm;
  const coolTitle=recovery?"Easy stretching and recovery check-in":activity.cool;
  return{id:options.id||"recommended",title:options.title||"Recommended",badge:options.badge||"Best match",total,intensity:COPY[level].label,targetEffort,segments:[{minutes:warm,title:warmTitle},{minutes:main,title:activity.main[level]},{minutes:cool,title:coolTitle}],note:options.note||COPY[level].note};
}

function buildPlanVariants(data,result){
  if(result.safety)return[makePlan(data,result)];
  let recommendedLevel=result.calculatedLevel;
  if(data.goal==="recover"&&["ready","moderate"].includes(recommendedLevel))recommendedLevel="low";
  const shortLevel=recommendedLevel==="ready"?"moderate":recommendedLevel;
  const recoveryLevel=result.calculatedLevel==="recovery"?"recovery":"low";
  return[
    makePlan(data,result,{id:"recommended",title:"Recommended",badge:"Best match",level:recommendedLevel,note:COPY[recommendedLevel].note}),
    makePlan(data,result,{id:"short",title:"Short session",badge:"Time saver",level:shortLevel,minutes:Math.max(15,data.minutes*.6),note:"A compact option that protects the purpose of today's session."}),
    makePlan(data,result,{id:"recovery",title:"Recovery alternative",badge:"Lowest load",level:recoveryLevel,minutes:Math.min(30,data.minutes),note:"Choose this when moving gently feels better than complete rest."})
  ];
}

function generatePlan(data,result){return buildPlanVariants(data,result)[0];}

function buildScenario(data,currentScore){
  const improved={...data,sleep:Math.max(7.5,data.sleep),fatigue:Math.max(1,data.fatigue-1)};
  const potential=calculateReadiness(improved).score;
  const gain=Math.max(0,potential-currentScore);
  if(!gain)return{title:"Protect the good signals",copy:"Your inputs are already strong. Consistency is the useful next step.",score:currentScore};
  return{title:`A ${gain}-point opportunity`,copy:"Explore the controls to see how individual recovery signals change the model.",score:potential};
}

function getResultCopy(level){return COPY[level];}
window.PlayReadyEngine={SPORT_LABELS,calculateReadiness,generatePlan,buildPlanVariants,buildScenario,getResultCopy};
})();
