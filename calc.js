function computeLoan(line) {


    var prin_cell = document.getElementById("prin" + line + "");
    var rate_cell = document.getElementById("intRate" + line + "");
    var pmt_cell = document.getElementById("pmt" + line + "");

    var prin = sanitizeNum(prin_cell.value);
    var rate = sanitizeNum(rate_cell.value);
    var pmt = sanitizeNum(pmt_cell.value);

    console.log(prin);

    var intLeft_cell = document.getElementById("intLeft" + line + "");
    var pmtLeft_cell = document.getElementById("pmtLeft" + line + "");


    var intPort = 0;
    var i = 0;
    var prinPort = 0;
    var accumInt = 0;
    var count = 0;

    if (prin > 0 && pmt > 0) {

        if (rate == 0) {
            i = 0;
        } else {
            i = rate;
            if (i >= 1) {
                i /= 100;
            }
            i /= 12;
        }

        while (prin > 0) {
            intPort = prin * i;
            prinPort = Number(pmt) - Number(intPort);
            accumInt += Number(intPort);
            prin -= Number(prinPort);
            count ++;
            if (count > 1000) {
                break;
            } else {
                continue;
            }
        }

        if (count >= 1000) {
            alert("At the terms you entered, debt #" + line +
                " will never be paid off. Please either decrease the balance, decrease the interest rate, or increase the payment amount until this message not longer pops up."
            );
            intLeft_cell.value = "ERROR";
            pmtLeft_cell.value = "ERROR";
        } else {
            intLeft_cell.value = "$" + formatNum(accumInt, 2, 1);
            pmtLeft_cell.value = count;
        }


    }

    clearResults(document.calc_form);

}

function computeForm(form) {
    jQuery('.email-my-results').removeClass('hidden');
    //Initialize variables for counting debts, total debt interest, total debt payments, and maximum number of periods.
    var debtCnt = 0;
    var i = 0;
    var totalDebtInt = 0;
    var totalDebtPmts = 0;
    var max_npr = 0;

    //Initialize arrays to store information about each debt, such as name, principal, balance, interest rate, payment, and other relevant details.
    var name_arr = new Array()
    var prin_arr = new Array()
    var adp_bal_arr = new Array()
    var rate_arr = new Array()
    var pmt_arr = new Array()
    var adp_pmt_arr = new Array()
    var npr_arr = new Array()
    var cost_arr = new Array()
    var sum_rows_arr = new Array()


    var Vschedule_head = "<tr><td><b>Pmt#</b></td>";

    var count = 0;
    var prinPort = 0;
    var intPort = 0;
    var name = "";
    var prin = 0;
    var intRate = 0;
    var intLeft = 0;
    var accumInt = 0;
    var accumPrin = 0;
    var pmt = 0;

    var Vtotalprin = 0;

    //Iterate through each debt input in the form.
    //Extract values for debt name, principal, interest rate, and monthly payment.
    //Calculate the total principal across all debts (Vtotalprin).
    while (i < 10) {

        i += Number(1);

        var name_cell = document.getElementById("D" + i + "");
        var prin_cell = document.getElementById("prin" + i + "");
        var intRate_cell = document.getElementById("intRate" + i + "");
        var pmt_cell = document.getElementById("pmt" + i + "");
        var intLeft_cell = document.getElementById("intLeft" + i + "");
        var pmtLeft_cell = document.getElementById("pmtLeft" + i + "");

        name = name_cell.value;
        prin = sanitizeNum(prin_cell.value);
        intRate = sanitizeNum(intRate_cell.value);
        pmt = sanitizeNum(pmt_cell.value);
        intLeft = sanitizeNum(intLeft_cell.value);


        Vtotalprin += Number(prin);


        if (prin > 0 && pmt > 0) {

            debtCnt += Number(1);
            accumPrin += Number(prin);

            Vschedule_head += "<td align='center'><b>" + name + "</b></td>";
            sum_rows_arr[i] = "<tr><td>" + name + "</td>";

            accumInt = 0;
            count = 0;

            if (intRate == 0) {
                intRate = 0;
            } else {
                if (intRate >= 1) {
                    intRate /= 100;
                }
                intRate /= 12;
            }

            name_arr[debtCnt] = name;
            prin_arr[debtCnt] = prin;
            adp_bal_arr[debtCnt] = prin;
            rate_arr[debtCnt] = intRate;
            pmt_arr[debtCnt] = pmt;
            adp_pmt_arr[debtCnt] = pmt;

            if (i == 1) {
                var test = prin_arr[1];
            }

            while (prin > 0) {
                intPort = prin * intRate;
                accumInt = Number(accumInt) + Number(intPort);
                prinPort = Number(pmt) - Number(intPort);
                prin = Number(prin) - Number(prinPort);
                count = Number(count) + Number(1);
                if (count > 1000) {
                    break;
                } else {
                    continue;
                }
            }
            totalDebtInt = Number(totalDebtInt) + (accumInt);
            totalDebtPmts = Number(totalDebtPmts) + Number(pmt);

            if (count > max_npr) {
                max_npr = count;
            }

            npr_arr[debtCnt] = count;
            cost_arr[debtCnt] = accumInt;

            pmtLeft_cell.value = count;
            intLeft_cell.value = "$" + formatNum(accumInt, 2, 1);


        } // if


    } // while

    // complete compare table-second one as you see
    document.calc_form.totalprin.value = "$" + formatNum(Vtotalprin, 2, 1);
    document.calc_form.adp_totalprin.value = "$" + formatNum(Vtotalprin, 2, 1);
    document.calc_form.totalint.value = "$" + formatNum(totalDebtInt, 2, 1);
    document.calc_form.totalnprs.value = max_npr;
    document.calc_form.totalpmt.value = "$" + formatNum(totalDebtPmts, 2, 1);

    Vschedule_head = Vschedule_head + "</tr>";
    document.calc_form.schedule_head.value = Vschedule_head;

    // console.log("Vschedule_head: " + Vschedule_head);

    var Vaccel_pmt = sanitizeNum(document.calc_form.accel_pmt.value);   //monthly addition money
    var Vadp_totalpmt = Number(totalDebtPmts) + Number(Vaccel_pmt);     //debt snowball total rpayment amount
    document.calc_form.adp_totalpmt.value = "$" + formatNum(Vadp_totalpmt, 2, 1);

    // compare table summary
    var v_summary_cell = document.getElementById("summary");

    var v_summary_txt = "The total of your current monthly debt payments " +
        "($" + formatNum(totalDebtPmts, 2, 1) + ") " +
        "+ The additional monthly amount ($" +
        formatNum(Vaccel_pmt, 2, 1) + ") " +
        "= " + "How much you will allocate to paying off " +
        "($" + formatNum(Vadp_totalpmt, 2, 1) + ") ";

    v_summary_cell.innerHTML = v_summary_txt;

    i = 0;
    var npr_cnt = 0;
    var adp_bal = 0;
    var adp_combo_prin = accumPrin;
    var debts_paid_off = 0;
    var next_debt_paid_off = 1;
    var Vadp_totalint = 0;
    var sum_col_print = 0;

    //VARIABLES FOR EACH PAYMENT ON EACH DEBT
    var adp_bal = 0;
    var adp_intPort = 0;
    var adp_prinPort = 0;
    var adp_rate = 0;
    var adp_excess_pmt = 0;


    //AMOUNT TO APPLY TO DEBT BEING FOCUSED ON
    var adp_pmt_amt = 0;

    //TOTAL OF ADP_PMTS PER PERIOD
    var tot_period_pmts = 0;

    //DEBT THAT EXTRA IS BEING APPLIED TO
    var cur_adp_debt = 1;

    //VARIEBLE TO COLLECT CHART ROWS
    var num_pmts = 0;
    var Vschedule_cols = "";
    var Vschedule_rows = "";
    var Vsummary_head = "<tr><td><b>Name of Debt</b></td><td><b>Begin<br>Bal:<br>Pmt:</b></td>";

    //DO UNTIL ALL DEBTS ARE PAID

    //createschedule
    while (debts_paid_off < debtCnt) {

        npr_cnt += Number(1);
        i = 0;
        adp_pmt_amt = Vaccel_pmt;



        //MAKE PMTS THIS PERIOD
        while (i < debtCnt) {

            //WHICH DEBTS ARE PAID OFF

            i += Number(1);
            num_pmts = Number(num_pmts) + Number(1);

            //GET THIS PAYMENTS CURRENT TERMS FROM ARRAY
            adp_bal = adp_bal_arr[i];
            adp_rate = rate_arr[i];
            adp_pmt = pmt_arr[i];

            if (npr_cnt == 1) {
                sum_rows_arr[i] = sum_rows_arr[i] + "<td>$" + formatNum(adp_bal, 0, 1) + "<br>$" +
                    formatNum(adp_pmt,
                        0, 1) + "</td>";
            }



            //IF THIS DEBT's BAL GREATER THAN ZERO, MAKE PMT
            if (adp_bal > 0) {
                adp_intPort = adp_bal * adp_rate;
                //adp_pmt = Number(adp_pmt) + Number(adp_pmt_amt);
                //adp_pmt_amt = 0;
                Vadp_totalint += Number(adp_intPort);
                adp_prinPort = Number(adp_pmt) - Number(adp_intPort);
                adp_bal = Number(adp_bal) - Number(adp_prinPort);
                if (adp_bal <= 0) {
                    adp_excess_pmt = Number(adp_bal * -1);
                    adp_pmt = Number(adp_pmt) - Number(adp_excess_pmt);
                    adp_prinPort = Number(adp_prinPort) - Number(adp_excess_pmt);
                    //ADD EXCESS PMT AMT TO ACCELERATOR AMT
                    adp_pmt_amt = Number(adp_pmt_amt) + Number(adp_excess_pmt);
                    adp_bal = 0;
                    debts_paid_off = Number(debts_paid_off) + 1;
                    sum_col_print = 1;

                }
                adp_bal_arr[i] = adp_bal;
                adp_combo_prin -= Number(adp_prinPort);
            } else { //ADD PMT AMOUNT TO ACCELERATOR

                //INCREMENT NUMBER TO NEXT DEBT
                cur_adp_debt += Number(1);

                //ADD UNEEDED PMT AMT TO ACCELERATOR AMT
                adp_pmt_amt += Number(adp_pmt);

                //SET THIS DEBT's PERIOD PAYMENT TO ZERO
                adp_pmt = 0;
            }

            adp_pmt_arr[i] = adp_pmt;

            if (i > 10) {
                break;
            } else {
                continue;
            }

        } //WHILE MAKING PATMENTS ON DEBTS THIS PERIOD



        i = 0;

        //IF EXCESS PAYMENT AMOUNT HAS NOT BEEN USED UP
        if (adp_pmt_amt > 0) {

            adp_combo_prin = Number(adp_combo_prin) - Number(adp_pmt_amt);

            while (i < debtCnt) {

                i = Number(i) + Number(1);

                if (adp_bal_arr[i] > 0) {

                    adp_bal_arr[i] = Number(adp_bal_arr[i]) - Number(adp_pmt_amt);

                    if (adp_bal_arr[i] > 0) {

                        adp_pmt_arr[i] = Number(adp_pmt_arr[i]) + Number(adp_pmt_amt);
                        adp_pmt_amt = 0;

                    } else {

                        adp_pmt_arr[i] = Number(adp_pmt_arr[i]) + Number(adp_pmt_amt) + Number(adp_bal_arr[i]);
                        adp_pmt_amt = Number(adp_pmt_amt) - (Number(adp_pmt_amt) + Number(adp_bal_arr[i]));
                        if (npr_cnt == 6 && i == 1) {
                            //document.debts.test2.value = adp_pmt_amt;
                        }
                        adp_bal_arr[i] = 0;
                        debts_paid_off = Number(debts_paid_off) + 1;
                        sum_col_print = 1;

                    }

                }


            }


        }

        i = 0;

        while (i < debtCnt) {

            i ++;

            tot_period_pmts += Number(adp_pmt_arr[i]);
            if (adp_pmt_arr[i] == 0) {
                Vschedule_cols += "<td align='right'> </td>";
            } else {
                Vschedule_cols += "<td align='right'>" + formatNum(adp_pmt_arr[i], 2, 1) +
                    "</td>";
            }

            if (adp_pmt_arr[debts_paid_off] == 0 && sum_col_print == 1 || debts_paid_off == debtCnt) {
                if (i == 1) {
                    Vsummary_head = Vsummary_head + "<td><b>Month " + npr_cnt + "<br>Bal:<br>Pmt:</b></td>";
                }

                if (adp_bal_arr[i] == 0) {
                    sum_rows_arr[i] = sum_rows_arr[i] + "<td align='top'>$0</td>";
                } else {
                    sum_rows_arr[i] = sum_rows_arr[i] + "<td align='top'>$" + formatNum(adp_bal_arr[i], 0,
                        1) + "<br>$" +
                        formatNum(adp_pmt_arr[i], 0, 1) + "</td>";
                }

                if (i == debtCnt) {
                    sum_col_print = 0;
                }
            }


        }



        //IF ACCUM UNEEDED AMT GREATER THAN ZERO, APPLY TO CURRENT DEBT's BALANCE
        //adp_bal_arr[cur_adp_debt] = Number(adp_bal_arr[cur_adp_debt]) - Number(adp_pmt_amt);
        //adp_combo_prin = Number(adp_combo_prin) - Number(adp_pmt_amt);

        Vschedule_rows = Vschedule_rows + "<tr><td align='right'>" + npr_cnt + "</td>" + Vschedule_cols +
            "</tr>";
        tot_period_pmts = 0;
        Vschedule_cols = "";


        if (npr_cnt > 600) {
            break;
        } else {
            continue;
        }


    } //WHILE ALL DEBTS ARE NOT PAID OFF

    document.calc_form.adp_totalnprs.value = npr_cnt;
    document.calc_form.adp_totalint.value = "$" + formatNum(Vadp_totalint, 2, 1);

    var Vadp_npr_save = Number(max_npr) - Number(npr_cnt);
    document.calc_form.adp_npr_save.value = Vadp_npr_save;

    var Vadp_int_save = Number(totalDebtInt) - Number(Vadp_totalint);
    document.calc_form.adp_int_save.value = "$" + formatNum(Vadp_int_save, 2, 1);

    Vsummary_head = Vsummary_head + "</tr>";

    document.calc_form.schedule_rows.value = Vschedule_rows;
    document.calc_form.summary_head.value = Vsummary_head;

    i = 0;
    var Vsummary_rows = "";

    while (i < debtCnt) {

        i = Number(i) + Number(1);

        Vsummary_rows = Vsummary_rows + "" + sum_rows_arr[i] + "</tr>";

    }

    document.calc_form.summary_rows.value = Vsummary_rows;
    console.log('test');
    createSchedule(form);
}

function createSchedule(calc_form) {
    var date = new Date();
    var month = new Array(12);
    var year = date.getYear();

    var Vschedule_head = document.calc_form.schedule_head.value;
    var Vschedule_rows = document.calc_form.schedule_rows.value;

    month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"
    ];

    if (year < 2000) {
        year += 1900;
    }
    var dateStr = month[date.getMonth()] + " " + date.getDate() + ", " + year;

    var adpPart1 = "<center><h2>Accelerated Debt-Payoff Plan</h2>" +
        "<p><b>Payment Schedule</b></p></center>" +
        "<center><table border='1' cellspacing='0' cellpadding='2'>" +
        "<tbody>" + Vschedule_head + "" + Vschedule_rows + "</tbody></table></center>" +
        "<p><center>Date: " + dateStr + "</center></p>";

    document.getElementById("report").innerHTML = adpPart1;
}

function createSummary(calc_form) {

    var date = new Date();
    var month = new Array(12);
    var year = date.getYear();

    var Vsummary_head = document.calc_form.summary_head.value;
    var Vsummary_rows = document.calc_form.summary_rows.value;

    month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"
    ];

    if (year < 2000) {
        year += 1900;
    }
    var dateStr = month[date.getMonth()] + " " + date.getDate() + ", " + year;

    var adpPart1 = "<head><title>Accelerated Debt-Payoff Plan</title></head>" +
        "<body><center>" +
        "<font face='arial'><big><strong>Accelerated Debt-Payoff Plan</strong></big></font>" +
        "<p><b>Payoff Summary</b></CENTER>" +
        "</p><p><center><table border='1' cellspacing='0' cellpadding='2'>" +
        "<tbody>" + Vsummary_head + "" + Vsummary_rows + "</tbody></TABLE></center></p>" +
        "<p><center>Date: " + dateStr + "</center></p>";

    reportWin = window.open("", "", "width=500,height=400,toolbar=yes,menubar=yes,scrollbars=yes");
    reportWin.document.write(adpPart1);
    reportWin.document.close();

}

function clearResults(calc_form) { //clear debt calculate result clear

    document.calc_form.totalprin.value = "";
    document.calc_form.totalpmt.value = "";
    document.calc_form.totalint.value = "";
    document.calc_form.totalnprs.value = "";

    document.calc_form.adp_totalprin.value = "";
    document.calc_form.adp_totalpmt.value = "";
    document.calc_form.adp_totalint.value = "";
    document.calc_form.adp_totalnprs.value = "";

    document.calc_form.adp_int_save.value = "";
    document.calc_form.adp_npr_save.value = "";

    document.calc_form.schedule_head.value = "";
    document.calc_form.schedule_rows.value = "";
    document.calc_form.summary_head.value = "";
    document.calc_form.summary_rows.value = "";

    var v_summary_cell = document.getElementById("summary");
    v_summary_cell.innerHTML = "";
    console.log("clear!");
    document.getElementById("report").innerHTML = "";
}

function clearStuff() { //clear report
    document.getElementById("report").innerHTML = "";
    return true;
}

function formatNum(num, places, comma) { //format number: '-12345.6789' to '-12,345.68'

    var isNeg = 0; //num is negative or positive

    if (num < 0) {
        num = num * -1;
        isNeg = 1;
    }

    var myDecFact = 1;
    var myPlaces = 0;
    var myZeros = "";
    while (myPlaces < places) {
        myDecFact = myDecFact * 10;
        myPlaces = Number(myPlaces) + Number(1);
        myZeros = myZeros + "0";
    }

    onum = Math.round(num * myDecFact) / myDecFact;

    integer = Math.floor(onum);

    if (Math.ceil(onum) == integer) {
        decimal = myZeros;
    } else {
        decimal = Math.round((onum - integer) * myDecFact)
    }
    decimal = decimal.toString();
    if (decimal.length < places) {
        fillZeroes = places - decimal.length;
        for (z = 0; z < fillZeroes; z++) {
            decimal = "0" + decimal;
        }
    }

    if (places > 0) {
        decimal = "." + decimal;
    }

    if (comma == 1) {
        integer = integer.toString();
        var tmpnum = "";
        var tmpinteger = "";
        var y = 0;

        for (x = integer.length; x > 0; x--) {
            tmpnum = tmpnum + integer.charAt(x - 1);
            y = y + 1;
            if (y == 3 & x > 1) {
                tmpnum = tmpnum + ",";
                y = 0;
            }
        }

        for (x = tmpnum.length; x > 0; x--) {
            tmpinteger = tmpinteger + tmpnum.charAt(x - 1);
        }


        finNum = tmpinteger + "" + decimal;
    } else {
        finNum = integer + "" + decimal;
    }

    if (isNeg == 1) {
        finNum = "-" + finNum;
    }

    return finNum;
}

function sanitizeNum(num) {     //sanitize number: '-sdfa123.45asd' to '-123.45'

    num=num.toString();


    var len = num.length;
    var rnum = "";
    var test = "";
    var j = 0;

    var b = num.substring(0,1);
    if(b == "-") {
       rnum = "-";
    }

    for(i = 0; i <= len; i++) {

       b = num.substring(i,i+1);

       if(Number(b) !== NaN || b == ".") {
          rnum = rnum + "" + b;
       }

    }

    if(rnum == "" || rnum == "-") {
       rnum = 0;
    }

    rnum = Number(rnum);

    return rnum;

 }