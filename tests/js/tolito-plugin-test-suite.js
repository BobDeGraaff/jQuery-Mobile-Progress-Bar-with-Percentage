var TolitoPluginTestSuite = {},
    UtilLib,
    PROGRESS_BAR_ELEMENT_ID = 'progressbar',
    OUTER_THEME = 'b',
    INNER_THEME = 'e',
    MINI = true,
    MAX = 100,
    START_FROM = 0,
    INTERVAL = 50,
    SHOW_COUNTER = true;

(function () 
{
    if (UtilLib === undefined) 
	{
        UtilLib = 
		{
            getValue: function (id) 
			{
                return $(['#', id].join("")).progressbar('option', 'value');
            },
            getClass: function (idOrEl) 
			{
                return (typeof idOrEl === 'string' ? $(['#', idOrEl].join("")) : idOrEl).attr("class");
            },
            getChild: function (id, seq) 
			{
                return $(['#', id].join("")).children().eq(seq);
            },
            stringExistsInString: function (str1, str2) 
			{
                return str2.indexOf(str1) != -1;
            }
        }
    }

    TolitoPluginTestSuite.run = function () 
	{
        QUnit.config.reorder = false;

        module("Configuration");

        test("Test Setters & Builder", function () 
		{
            expect(12);
			tolito = TolitoProgressBar(PROGRESS_BAR_ELEMENT_ID)
                .setOuterTheme(OUTER_THEME)
                .setInnerTheme(INNER_THEME)
                .isMini(MINI)
                .setMax(MAX)
                .setStartFrom(START_FROM)
                .setInterval(INTERVAL)
                .showCounter(SHOW_COUNTER)
                .build();
			ok(tolito !== undefined, "Progress bar is defined");
            strictEqual(tolito.getOuterTheme(), OUTER_THEME, "Outer theme setter");
            strictEqual(tolito.getInnerTheme(), INNER_THEME, "Inner theme setter");
            strictEqual(tolito.getMini(), MINI, "Is mini setter");
            strictEqual(tolito.getMax(), MAX, "Max value setter");
            strictEqual(tolito.getStartFrom(), START_FROM, "Start from setter");
            strictEqual(tolito.getInterval(), INTERVAL, "Interval setter");
            strictEqual(tolito.getShowCounter(), SHOW_COUNTER, "Show counter setter");
            var classValue = UtilLib.getClass(PROGRESS_BAR_ELEMENT_ID);
            ok(UtilLib.stringExistsInString(["ui-tolito-progressbar", MINI ? "-mini" : ""].join(""), classValue),
                "Contains mini or normal class");
            ok(UtilLib.stringExistsInString(["ui-tolito-progressbar-outer-", OUTER_THEME].join(""), classValue),
                "Contains correct outer theme");
            var classValueOfFirstChild = UtilLib.getClass(UtilLib.getChild(PROGRESS_BAR_ELEMENT_ID, 0));
            ok(SHOW_COUNTER ? UtilLib.stringExistsInString("ui-tolito-progressbar-label", classValueOfFirstChild) :
                true, "Contains label");
            var classValueOfSecondChild = UtilLib.getClass(UtilLib.getChild(PROGRESS_BAR_ELEMENT_ID, 1));
            ok(UtilLib.stringExistsInString(["ui-tolito-progressbar-active-", INNER_THEME].join(""), SHOW_COUNTER ?
                classValueOfSecondChild : classValueOfFirstChild), "Contains correct inner theme");
        });

        module("Functionality");

        test("Test Set Value", function () 
		{
            expect(3);
            strictEqual(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID), START_FROM, ["Initial value is ", START_FROM].join(""));
            tolito.setValue(10);
            strictEqual(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID), 10, "Value is 10");
            tolito.setValue(START_FROM);
            strictEqual(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID), START_FROM, ["Value is ", START_FROM].join(""));
        });

        test("Test Runner", function () 
		{
            expect(3);
            var beforeVal = UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID);
            tolito.run();
            stop();
            setTimeout(function () 
			{
                tolito.stop();
                var afterVal = UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID);
                ok(afterVal > beforeVal, "Value after run is greater");
                stop();
                setTimeout(function () 
				{
                    strictEqual(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID), afterVal, "Value is not changed after stop");
					tolito.run();
					stop();
					setTimeout(function () 
					{
						ok(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID) > afterVal, "Run after stop works");
						tolito.stop();
						start();
					}, 50);
                    start();
                }, 50);
                start();
            }, 100);
        });

        test("Test Event", function () 
		{
            expect(1);
            tolito.run();
            stop();
            $(document)
                .on('complete', ['#', PROGRESS_BAR_ELEMENT_ID].join(""), function () 
			{
                strictEqual(UtilLib.getValue(PROGRESS_BAR_ELEMENT_ID), 100, "Value is max when bar is completed");
                start();
            });
        });
    }
}());

$(document).on('pageinit', '#test-page', function () {
	TolitoPluginTestSuite.run();
});