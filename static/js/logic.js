var questions = {
    Economy: [{q:'The federal government should increase minimum wage...', l1:'not at all', l5:'to 15 dollars', t1:3, c1:0, t5:7, c5:10},
        {q:'I support the Trans-Pacific Partnership.', t1:10, c1:7, t5:0, c5:3},
        {q:'Corporate tax must be...', l1:'lowered', l5: 'raised', t1:10, c1:0, t5:0, c5:10}],
    Social_issues: [{q:'Abortion should be...', l1:'illegal in all cases, including rape and incest', l5:'legalized', t1:7, c1:1, t5:3, c5:9},
    {q:'The federal government should mandate universal background checks for all gun purchasers', t1:8, c1:0, t5:1, c5:9},
    {q:'The federal government should mandate body cameras on all police officers', t1: 8, c1: 0, t5: 2, c5: 10}],
    Foreign_policy: [{q:'The U.S. should declare war on ISIS and send in ground troops.', t1: 0, c1: 2, t5: 10, c5: 8},
    {q:'When considering foreign conflicts, the U.S. should...', l1: 'attempt to maintain balances of power.', l5: 'only become involved for self-defense', t1: 0, c1: 10, t5: 10, c5: 0},
{q:'The government should _______ foreign aid spending.', l1: 'decrease', l5: 'increase', t1: 10, c1: 0, t5: 0, c5: 10}],
Immigration: [{q:'The federal government should deal with illegal immigrants without criminal records by...', l1: 'creating a path to citizenship', l5: 'deporting them', t1: 0, c1: 0, t5: 10, c5: 0},
    {q:"Immigrants of a certain race or religion pose a threat to the country's domestic welfare and should be banned accordingly.", t1: 10, c1: 0, t5: 0, c5: 10},
    {q:'We should increase restrictions on border security.', t1:0, c1:10, t5:10, c5:0}],
Healthcare: [{q:'The government should regulate prices for...', l1:'no drugs', l5:'all prescription drugs', t1: 0, c1: 0, t5: 10, c5: 10},
    {q:'The Affordable Care Act should be repealed.', t1:0, c1:10, t5:10, c5: 0 }],
    Environment: [{q:'The government should provide tax credits and subsidies for companies seeking alternate energy sources.', t1:10, c1:0, t5:0, c5:10},
    {q:'The government should increase environmental regulations that mitigate the effects of climate change.', t1: 0, c1:0, t5:10, c5:10}],
    Education: [{q:'The government should decrease interest rates on student loans.', t1:0, c1:10, t5:10, c5:0},
    {q:'Education standards should be universal across the country.', t1:0, c1:10, t5:10, c5:0}]
};
var keys = Object.keys(questions);

var category_i = 0;
var question_i = 0;
var current_q = questions[keys[category_i]][question_i];
var last_score = 0;

var question_text;
var category_text;
var answer_element;
var img_element;
var gif_element;
var label1;
var label5;

var format_key = function(i)
{
    return keys[i].replace('_', ' ');
};

/*
var update_morph = function(score)
{
    var url = '/morph/' + score + '.jpg';
    $.ajax({
        url : url,
        processData : false
    }).always(function(){
        img_element.attr("src", url);
    });
};*/

var transition_gif = function(from_score, to_score)
{
    if (from_score == to_score)
        return;

    var fname;
    if (from_score < to_score)
    {
        fname = from_score.toString() + '.gif';
    } else
    {
        fname = to_score.toString() + 'r.gif';
    }

    console.log('Playing gif ' + fname);

    gif_element.attr('src', 'images/' + fname);

    if (Math.abs(from_score - to_score) > 1)
    {
        setTimeout(function(){

            if (from_score < to_score)
            {
                transition_gif(from_score + 1, to_score);
            } else
            {
                transition_gif(from_score, to_score - 1);
            }

        }, 500);
    }
};

var next_question = function() {

    // TODO access value of answer_element correctly
    current_q.answer = parseInt(answer_element.val());

    // update score
    var score = calculate_score();
    console.log('Score: ' + score);
    // TODO use score
    transition_gif(last_score, score);
    last_score = score;

    question_i++;
    if (question_i == questions[keys[category_i]].length)
    {
        question_i = 0;
        category_i++;
        if (category_i == keys.length)
        {
            // finished
        }

        category_text.html(format_key(category_i));
    }
    current_q = questions[keys[category_i]][question_i];
    question_text.html(current_q.q);

    if (current_q.hasOwnProperty('l1'))
        label1.html(current_q.l1);
    else
        label1.html('Strongly disagree');

    if (current_q.hasOwnProperty('l5'))
        label5.html(current_q.l5);
    else
        label5.html('Strongly agree');

};

var init = function()
{
    question_text = $('#question-text');
    category_text = $('#category-text');
    answer_element = $('#answer-element');
    img_element = $("#morph");
    gif_element = $("#gif");
    label1 = $("#l1");
    label5 = $("#l5");

    category_text.html(format_key(category_i));
    console.log(questions[keys[category_i]][question_i].q);
    console.log(question_text);
    question_text.html(questions[keys[category_i]][question_i].q);
};


// Calculates rating based on all the questions that were answered. The more negative = the more pro-Trump,
// the more positive = the more pro-Clinton
var calculate_score = function()
{
    var trump_sum = 0;
    var clinton_sum = 0;

    for (var i = 0; i < keys.length; i++)
    {
        for (var j = 0; j < questions[keys[i]].length; j++)
        {
            var q = questions[keys[i]][j];
            if (q.hasOwnProperty('answer'))
            {
                trump_sum += q.t1 + (q.t5 - q.t1) * q.answer / 5.0;
                clinton_sum += q.c1 + (q.c5 - q.c1) * q.answer / 5.0;
            }
        }
    }

    var score = clinton_sum - trump_sum;
    score = Math.round(score / 2);
    // we want the value to be in [-cap, cap]
    var cap = 10;
    score = Math.min(score, cap);
    score = Math.max(score, -cap);
    return score;
};
