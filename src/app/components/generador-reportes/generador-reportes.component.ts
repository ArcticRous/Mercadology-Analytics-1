import { DOCUMENT } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// declare var gapi: any;
// declare const ViewSelector2: any;

@Component({
  selector: 'app-generador-reportes',
  // template: './reportes.component.html',//'<script [src]="iframe"></iframe>',
  templateUrl: './generador-reportes.component.html', 
  styleUrls: ['./generador-reportes.component.css']
})
export class GeneradorReportesComponent implements OnInit {

  dangerousVideoUrl: any;
  videoUrl: any;
  scriptViewSelector: any;
  scriptViewSeguro: any;
  constructor(//private _renderer2: Renderer2,
    // @Inject(DOCUMENT) private _document: Document,
    // private sanitizer: DomSanitizer,
    ) {





  }


  ngOnInit(): void {
    
  }//Fin ngoninit


}//Fin export





    // (function (w, d, s, g, js, fs) {

    //   g = w.gapi || ( w.gapi = {}); g.analytics = { q: [], ready: function (f) { this.q.push(f); } }; 
    //   js = d.createElement(s); fs = d.getElementsByTagName(s)[0];
    //   js.src = 'https://apis.google.com/js/platform.js';

    //   fs.parentNode.insertBefore(js, fs); js.onload = function () { g.load('analytics'); };
    // }(window, document, 'script'));



  //   let elemento = this._document.getElementById('elementId');
  // let script = this._renderer2.createElement('script');
  // script.type = 'text/javascript'; //'application/javascript';
  // script.src = 'https://ga-dev-tools.appspot.com/public/javascript/embed-api/components/view-selector2.js';
  // this._renderer2.appendChild(elemento, script); 


//     gapi.analytics.ready(function () {

//       /**
//        * Authorize the user immediately if the user has already granted access.
//        * If no access has been created, render an authorize button inside the
//        * element with the ID "embed-api-auth-container".
//        */
//       gapi.analytics.auth.authorize({
//         container: 'embed-api-auth-container',
//         clientid: '987910429607-i6qs3kfss7d9bg1trth4o6rtii014t08.apps.googleusercontent.com'
//       });


//       /**
//        * Store a set of common DataChart config options since they're shared by
//        * both of the charts we're about to make.
//        */
//       var commonConfig = {
//         query: {
//           metrics: 'ga:sessions',
//           dimensions: 'ga:date'
//         },
//         chart: {
//           type: 'LINE',
//           options: {
//             width: '100%'
//           }
//         }
//       };


//       /**
//        * Query params representing the first chart's date range.
//        */
//       var dateRange1 = {
//         'start-date': '14daysAgo',
//         'end-date': '8daysAgo' 
//       };


//       /**
//        * Create a new ViewSelector2 instance to be rendered inside of an
//        * element with the id "view-selector-container".
//        */
//       var viewSelector = new gapi.analytics.ext.ViewSelector2({
//         container: 'view-selector-container',
//       }).execute();


//       /**
//        * Create a new DateRangeSelector instance to be rendered inside of an
//        * element with the id "date-range-selector-1-container", set its date range
//        * and then render it to the page.
//        */
//       var dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector({
//         container: 'date-range-selector-1-container'
//       })
//         .set(dateRange1)
//         .execute();


//       /**
//        * Create a new DataChart instance with the given query parameters
//        * and Google chart options. It will be rendered inside an element
//        * with the id "data-chart-1-container".
//        */
//       var dataChart1 = new gapi.analytics.googleCharts.DataChart(commonConfig)
//         .set({ query: dateRange1 })
//         .set({ chart: { container: 'data-chart-1-container' } });

//       /**
//        * Register a handler to run whenever the user changes the view.
//        * The handler will update both dataCharts as well as updating the title
//        * of the dashboard.
//        */
//       viewSelector.on('viewChange', function (data) {
//         dataChart1.set({ query: { ids: data.ids } }).execute();

//         var title = document.getElementById('view-name');
//         console.log(title);
//         title.textContent = data.property.name + ' (' + data.view.name + ')';
//       });


//       /**
//        * Register a handler to run whenever the user changes the date range from
//        * the first datepicker. The handler will update the first dataChart
//        * instance as well as change the dashboard subtitle to reflect the range.
//        */
//       dateRangeSelector1.on('change', function (data) {
//         dataChart1.set({ query: data }).execute();
//         console.log("holaaaa");
//         // Update the "from" dates text.
//         var datefield = document.getElementById('from-dates');
//         console.log(data);
//         datefield.textContent = data['start-date'] + '&mdash;' + data['end-date'];
//       });



//     });        







//  }













    // gapi.analytics.ready(function() {

    //   // Step 3: Authorize the user.

    //   let CLIENT_ID = '987910429607-i6qs3kfss7d9bg1trth4o6rtii014t08.apps.googleusercontent.com';

    //   gapi.analytics.auth.authorize({
    //     container: 'auth-button',
    //     clientid: CLIENT_ID,
    //   });

    //   // Step 4: Create the view selector.

    //   let viewSelector = new gapi.analytics.ViewSelector({
    //     container: 'view-selector'
    //   });

    //   // Step 5: Create the timeline chart.

    //   let timeline = new gapi.analytics.googleCharts.DataChart({
    //     reportType: 'ga',
    //     query: {
    //       'dimensions': 'ga:date',
    //       'metrics': 'ga:sessions',
    //       'start-date': '30daysAgo',
    //       'end-date': 'yesterday',
    //     },
    //     chart: {
    //       type: 'LINE',
    //       container: 'timeline'
    //     }
    //   });

    //   // Step 6: Hook up the components to work together.

    //   gapi.analytics.auth.on('success', function(response) {
    //     viewSelector.execute();
    //   });

    //   viewSelector.on('change', function(ids) {
    //     var newIds = {
    //       query: {
    //         ids: ids
    //       }
    //     }
    //     timeline.set(newIds).execute();
    //   });
    // });