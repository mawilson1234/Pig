PennController.ResetPrefix(null) // Shorten command names (keep this line here)
DebugOff()

//var counterOverride = 0

var centered_justified_style = {
    "text-align": "justify", 
    margin: '0 auto', 
    'margin-bottom': '3em',
    width: '30em'
}

function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length && main.length > 0; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

SetCounter('setcounter')

Sequence(
    // 'setcounter', 
    // 'consent', 
    // 'instructions_1', 
    // 'instructions_2', 
    // 'instructions_3',
    // 'no_feedback_practice',
    randomize('feedback_practice'), 
    'post_practice',
    sepWithN(
        'break', 
        rshuffle('experiencer', 'hagf', 'fillers_nonpresentational', 'fillers_presentational', 'dative'), 
        30
    ),
    'feedback', 
    SendResults(), 
    'bye'
)

newTrial("consent",
    newText(
        "Before starting the experiment, you will need to give consent. " + 
        "Please click <a href='https://campuspress.yale.edu/michaelwilson/files/2022/09/consent.pdf' target='_blank'>here</a> to download the consent form for this study. " +
        "If you read it and agree to participate in this study, click 'I Agree' below. " + 
        "If you do not agree to participate in this study, you can leave this page by closing the tab or window."
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newButton("Agree", "I Agree")
        .center()
        .print()
        .wait()
).setOption("countsForProgressBar", false)

newTrial('instructions_1',
    newHtml('instructions_1', 'instructions_1.html')
        .css(centered_justified_style)
        .radioWarning('You must select an option for \'%name%\'.')
        .print()
        .log()
    ,
    
    newButton('Next', 'Next')
        .center()
        .print()
        .wait(
            getHtml('instructions_1')
                .test.complete()
                .failure(
                    getHtml('instructions_1').warn()
                )
        )
)

newTrial('instructions_2',
    newHtml('instructions_2', 'instructions_2.html')
        .css(centered_justified_style)
        .radioWarning('You must select an option for \'%name%\'.')
        .print()
        .log()
    ,
    
    newButton('Next', 'Next')
        .center()
        .print()
        .wait(
            getHtml('instructions_2')
                .test.complete()
                .failure(
                    getHtml('instructions_2').warn()
                )
        )
)

newTrial('instructions_3',
    newHtml('instructions_3', 'instructions_3.html')
        .css(centered_justified_style)
        .radioWarning('You must select an option for \'%name%\'.')
        .print()
        .log()
    ,
    
    newButton('Next', 'Next')
        .center()
        .print()
        .wait(
            getHtml('instructions_3')
                .test.complete()
                .failure(
                    getHtml('instructions_3').warn()
                )
        )
)

var practice_no_feedback_trial = label => item => {
    return [
        label,
        'Separator', {transfer: 1000, normalMessage: '+'},
        'EPDashedSentence', {s: item.sentence, display: 'in place'},
        'Separator', {
            transfer: 1000, 
            normalMessage: '+'
        },
        'PennController', PennController()
            .log('item',          item.item)
            .log('sentence',      item.sentence)
            .log('subexperiment', label)
    ]
}

var no_feedback_trial = label => item => {
    return [
        label,
        'Separator', {transfer: 1000, normalMessage: '+'},
        'EPDashedSentence', {s: item.sentence, display: 'in place'},
        'QuestionAlt', {
            q: item.question,
            as: [['f', item.left_answer], ['j', item.right_answer]],
            randomOrder: false,
            presentHorizontally: true,
            hasCorrect: item.left_answer == item.correct_answer ? 0 : 1
        },
        'Separator', {
            transfer: 1000, 
            normalMessage: '+', 
            ignoreFailure: true
        },
        'PennController', PennController()
            .log('group',            item.group)
            .log('item',             item.item)
            .log('sentence',         item.sentence)
            .log('question',         item.question)
            .log('left_answer',      item.left_answer)
            .log('right_answer',     item.right_answer)
            .log('correct_answer',   item.correct_answer)
            .log('sentence_voice',   item.sentence_voice)
            .log('question_voice',   item.question_voice)
            .log('verb_type',        item.verb_type)
            .log('verb',             item.verb)
            .log('s_voice_log_odds', item.s_voice_log_odds)
            .log('q_voice_log_odds', item.q_voice_log_odds)
            .log('se_log_odds',      item.se_log_odds)
            .log('subexperiment',    label)
    ]
}

var feedback_trial = label => item => {
    var check_keys = [
        'group',
        'structure',
        'verb',
        'indirect_object_animacy',
        'verb_type',
        'complementizer',
        'adverb_position',
        'sentence_voice',
        'question_voice'
    ]
    
    var d = {}
    for (var key in check_keys) {
        d[key] = key in item ? item[key] : 'NA'
    }
    
    return [
        label,
        'Separator', {transfer: 1000, normalMessage: '+'},
        'EPDashedSentence', {s: item.sentence, display: 'in place'},
        'QuestionAlt', {
            q: item.question,
            as: [['f', item.left_answer], ['j', item.right_answer]],
            randomOrder: false,
            presentHorizontally: true,
            hasCorrect: item.correct_answer === 'False' ? false : (item.left_answer == item.correct_answer ? 0 : 1)
        },
        'Separator', {
            transfer: 1000, 
            normalMessage: '+', 
            errorMessage: 'Wrong answer. Please read slowly and carefully.'
        },
        'PennController', PennController()
            .log('group',          d.group)
            .log('item',           item.item)
            .log('sentence',       item.sentence)
            .log('question',       item.question)
            .log('left_answer',    item.left_answer)
            .log('right_answer',   item.right_answer)
            .log('correct_answer', item.correct_answer)
            .log('structure',      d.structure)
            .log('verb',           d.verb)
            .log('indirect_object_animacy', d.indirect_object_animacy)
            .log('verb_type',      d.verb_type)
            .log('complementizer', d.complementizer)
            .log('subexperiment',  label)
    ]
}

Template('practice-1.csv', practice_no_feedback_trial('no_feedback_practice'))
Template('practice-2.csv', feedback_trial('feedback_practice'))

newTrial('post_practice',
    newText('post-pr', 'That\'s it for practice! Click below when you\'re ready to begin the experiment.')
        .css(centered_justified_style)
        .print()
    ,

    newButton('Click', 'Click here to begin the experiment')
        .center()
        .print()
        .wait()
)

newTrial('break',
    newText('You may now take a short break. Click below when you are ready to return to the experiment.')
        .css(centered_justified_style)
        .print()
    ,
    newButton('click', 'Click here to return to the experiment')
        .center()
        .print()
        .wait()
)

Template('experiencer.csv', no_feedback_trial('experiencer'))

Template('hagf.csv', feedback_trial('hagf'))
Template('fillers-nonpres.csv', feedback_trial('fillers_nonpresentational'))
Template('fillers-pres.csv', feedback_trial('fillers_presentational'))
Template('dative.csv', feedback_trial('dative'))


newTrial('feedback',
    newText(
            'That\'s it for the experiment! We have just a few ' +
            'follow-up questions that will help us interpret ' +
            'your responses.'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newText(
        'What, if anything, stood out to you about the sentences ' +
        'that you saw?'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newTextInput('feedback_sentences')
        .cssContainer('text-align', 'center')
        .log()
        .lines(10)
        .print()
    ,
    
    newText(
        'Did anything make the sentences hard to understand?'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newTextInput('feedback_hard_to_understand_sentences')
        .cssContainer('text-align', 'center')
        .log()
        .lines(10)
        .print()
    ,
    
    newText(
        'Did you feel like you adopted any strategies or shortcuts ' +
        'while reading, or do you think anything about your reading ' +
        'changed during the experiment?'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newTextInput('feedback_strategies_sentences')
        .cssContainer('text-align', 'center')
        .log()
        .lines(10)
        .print()
    ,

    newText(
        'Did you experience any difficulties (technical or otherwise) ' +
        'in doing the experiment?'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newTextInput('feedback_difficulties')
        .cssContainer('text-align', 'center')
        .log()
        .lines(10)
        .print()
    ,
    
    newText(
        'To help us screen for automated completions, please briefly ' +
        'respond to the following prompt: image you drove (or walked) ' +
        'from your house to the closest major shopping mall. Describe ' +
        'the most boring thing and the most interesting thing you ' +
        'would see along the way.'
    )
        .css(centered_justified_style)
        .print()
    ,
    
    newTextInput('feedback_bot')
        .cssContainer('text-align', 'center')
        .log()
        .lines(10)
        .print()
    ,
    
    
    newText('What device/OS did you use to complete the experiment?')
        .css(centered_justified_style)
        .print()
    ,
    
    newDropDown('device', 'Choose your device/OS')
        .add(
            'Windows laptop or desktop', 
            'Apple Macintosh laptop or desktop',
            'Chrome OS laptop or desktop',
            'Unix/Linux laptop or desktop',
            'Other OS laptop or desktop', 
            'Other device'
        )
        .center()
        .print()
    ,
    
    newButton('Next','Next')
        .center()
        .print()
        .disable()
    ,
    
    getDropDown('device')
        .wait()
        .log()
    ,
    
    getButton('Next')
        .enable()
        .wait()
)

newTrial('bye',
    newText(
        'Thank you for participating!<p />' +
        
        'Please go to the following web page to verify your participation: ' +
        '<a href="https://app.prolific.co/submissions/complete?cc=6CC6F58A" target="_blank">' +
        'https://app.prolific.co/submissions/complete?cc=6CC6F58A' +
        '</a>.'
    )
        .css({'margin': 'auto', 'text-align': 'center', 'width': '30em'})
        .print(),
        
    newButton().wait()
)
.setOption('countsForProgressBar' , false)