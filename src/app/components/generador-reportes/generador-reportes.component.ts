import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

declare const gapi: any;

@Component({
  selector: 'app-generador-reportes',
  templateUrl: './generador-reportes.component.html',
  styleUrls: ['./generador-reportes.component.css']
})
export class GeneradorReportesComponent implements OnInit {

  dangerousVideoUrl: any;
  videoUrl: any;
  scriptViewSelector: any;
  scriptViewSeguro: any;

  loadingUsers: boolean = true;

  // VIEW_ID = '230218277';
  VIEW_ID = '210355580';

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  constructor() {
    // const _self = this;
    // window['onSignIn'] = function (user) { _self.onSignIn(user); };

    // window['onSignIn'] = (user) => this.ngZone.run(() => this.onSignIn(user))
  }


  ngOnInit(): void {
    // this.queryReports();
    // (window as any).googleLogin = this.googleLogin
  }//Fin ngoninit

  ngAfterViewInit() {
    gapi.signin2.render('google-signin2', {
      'scope': 'profile email',
      'width': 800,
      'height': 50,
      'longtitle': true,
      'onsuccess': param => this.onSignIn(param),
      'onfailure': this.onFailure()
    });
  }

  onSignIn(googleUser) {
    this.queryReports()
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }

  onFailure() {
    console.log("Fallo Conexión");
  }


  // Query the API and print the results to the page.
  queryReports() {

    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:date"
              },
              {
                name: "ga:segment"
              },
              {
                name: "ga:keyword"
              },
              {
                name: "ga:medium"
              },
              {
                name: "ga:source"
              }
            ],
            segments: [{ "segmentId": "gaid::-5" }, { "segmentId": "gaid::-7" }],
            orderBys: [
              {
                fieldName: "ga:date", sortOrder: "ASCENDING"
              }
            ]
          }
        ]
      }
    }).then(this.displayResults, console.error.bind(console))
      .catch(console.log("Erick")
      )


    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:date"
              }
            ],
            orderBys: [
              {
                fieldName: "ga:date", sortOrder: "ASCENDING"
              }
            ]
          }
        ]
      }
      // }).then(this.displayResultsUsers, console.error.bind(console))
    }).then(resp => {
      console.log(resp);
      this.displayResultsUsers(resp)
    })
      .catch(console.log("Erick")
      )


    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:pagePath"
              }
            ],
            orderBys: [
              {
                fieldName: "ga:users", sortOrder: "DESCENDING"
              }
            ],
          }
        ]
      }
    }).then(this.displayResults, console.error.bind(console))
      .catch(console.log("Erick")
      )

  }//Termina metodo de queryreports

  displayResults(response) {
    var formattedJson = JSON.stringify(response.result, null, 2);
    console.log(response.result);

    // console.log(formattedJson);
  }

  displayResultsUsers(response) {
    let arrDimensions = []
    let arrMetrics = []

    var formattedJson = JSON.stringify(response.result, null, 2);
    // console.log(response.result);
    // console.log(response.result.reports[0].columnHeader.metricHeader.metricHeaderEntries[0]);
    // console.log(response.result.reports[0].data.rows[0].dimensions[0]);
    // console.log(response.result.reports[0].data.rows[0].metrics[0].values[0]);
    response.result.reports[0].data.rows.map(({ dimensions, metrics }) => {
      console.log(dimensions[0].substring(6, 8), metrics[0].values[0]);

      arrDimensions.push(dimensions[0].substring(6, 8))
      arrMetrics.push(parseInt(metrics[0].values[0]))

    })

    this.barChartLabels = arrDimensions
    this.barChartData.push({ data: arrMetrics, label: 'Usuarios' })
    console.log(this.barChartData);
    console.log(this.barChartLabels);


// this.cambiar()
    this.loadingUsers = false
    // console.log(formattedJson);
  }


  cambiar() {
    console.log("eirkc");
    this.loadingUsers = false

    
  }




}//Fin export

