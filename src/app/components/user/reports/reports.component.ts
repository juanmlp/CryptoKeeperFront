import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { CryptosService } from 'src/app/services/cryptos.service';
import { CryptoReport } from 'src/app/models/crypto-report.model';
import { GraphData } from 'src/app/models/graph-data.model';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent implements OnInit {

  cryptos: any[] = [];
  cryptoObj: CryptoReport = { crypto: '', price: 0, date: '' };
  cryptoData: CryptoReport[] = [];
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  lastNumberMonths: number[] = [];
  lastStringMonths: string[] = [];
  cryptoProfits: CryptoReport[] = [];
  cryptoLabel: string[] = [];
  cryptoGraphData: GraphData = { data: [], label: '' };



  chartData: GraphData[] = [
    /*     {
          data: [330, 0, 0, 0],
          label: this.cryptoLabel[0]
        },
        {
          data: [120, 455, 100, 340],
          label: 'Account B'
        },
        {
          data: [45, 67, 800, 500],
          label: 'Account C'
        } */
  ];

  chartLabels = this.lastStringMonths;

  chartOptions = {
    responsive: true
  };

  // Doughnut
  public doughnutChartLabels: Label[] = []
  public doughnutChartData: number[] = [];
  public doughnutChartType: ChartType = 'doughnut';



  // Radar

  public pieChartColors: Array<any> = [{
    backgroundColor: ['rgb(255, 205, 86)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)']
  }];

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private cryptoServices: CryptosService) { }

  ngOnInit(): void {
    this.cryptoServices.getAllCryptos().then(u => {
      this.cryptos = u;
      this.getDate();
      this.getCryptosData();
      this.getCryptoDataChart();
      this.doughnutChartLabels = this.cryptoData.map(crypto => crypto.crypto);
      this.doughnutChartData = this.cryptoData.map(crypto => Number(crypto.price));
      //console.log(this.cryptoData);

    })
  }


  getCryptosData() {
    this.cryptos.map(crypto => {
      const exist = this.cryptoData.find(data => data.crypto === crypto.crypto);

      if (exist) {
        this.cryptoData.map(data => {
          if (data.crypto == crypto.crypto) {
            data.price += Number(crypto.price);
          }
        })

      } else {
        this.cryptoObj.crypto = crypto.crypto;
        this.cryptoObj.price = Number(crypto.price);
        this.cryptoData.push(this.cryptoObj);

        this.cryptoObj = { crypto: '', price: 0, date: '' };
      }
    });
  };

  getCryptoDataChart() {
    this.cryptos.map(crypto => {
      let cryptoDate = new Date(crypto.date).getMonth();
      const dateMatch = this.lastNumberMonths.find(date => date === cryptoDate);
      const exist = this.cryptoProfits.find(data => data.crypto === crypto.crypto && new Date(data.date).getMonth() === cryptoDate);

      if (exist && dateMatch) {
        this.cryptoProfits.map(data => {
          if (data.crypto === crypto.crypto) {
            data.price += Number(crypto.price);
          }
        })

      } else if (dateMatch) {
        this.cryptoObj.crypto = crypto.crypto;
        this.cryptoObj.price = Number(crypto.price);
        this.cryptoObj.date = crypto.date;
        this.cryptoProfits.push(this.cryptoObj);

        const existLabel = this.cryptoLabel.find(data => data === crypto.crypto);

        if (!existLabel && this.cryptoLabel.length <= 2) {
          this.cryptoLabel.push(crypto.crypto)
        }

        this.cryptoObj = { crypto: '', price: 0, date: '' };
      }
    });

    this.chartData = [];
    
    for (var i = 0; i <= 2; i++) {
      let arr: number[] = [];

      this.cryptoProfits.map(crypto => {
        let cryptoDate = new Date(crypto.date).getMonth();
        if (crypto.crypto === this.cryptoLabel[i]) {
          this.lastNumberMonths.map(month => {
            if (month === cryptoDate && arr.length <= 3) {
              arr.push(Number(crypto.price));
            } else if (arr.length <= 3) {
              arr.push(0);
            } else {
              const index = this.lastNumberMonths.indexOf(cryptoDate)
              arr[index] = crypto.price;
            }

          })
        }
      })
      this.cryptoGraphData.data = arr;
      this.cryptoGraphData.label = this.cryptoLabel[i];
      this.chartData.push(this.cryptoGraphData);


      this.cryptoGraphData = { data: [], label: '' };
    }
  }

  getDate() {
    let TodayDate = new Date();
    let actualMonth = TodayDate.getMonth() + 1;

    for (let i = 0; i <= 3; i++) {
      this.lastNumberMonths.push(actualMonth - i);
      this.lastStringMonths.push(this.monthNames[actualMonth - i]);
    }

    this.lastStringMonths = this.lastStringMonths.reverse();
    this.lastNumberMonths = this.lastNumberMonths.reverse();

  }




}


