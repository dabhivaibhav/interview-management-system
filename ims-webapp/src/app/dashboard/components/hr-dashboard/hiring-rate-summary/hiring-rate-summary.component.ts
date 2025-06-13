import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-hiring-rate-summary',
  templateUrl: './hiring-rate-summary.component.html',
  styleUrls: ['./hiring-rate-summary.component.css']
})
export class HiringRateSummaryComponent implements OnInit {
  isLoading = false;
  data: any[] = [];
  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) { }
  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getInterviewSummaryByHiringRate());

  }

  drawChart(data: any[] = []): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'title');
    dataTable.addColumn('number', 'count');
    let total = 0;
    data.sort((a, b) => b.count - a.count);
    data.forEach(item => {
      total += item.count;
      dataTable.addRow([item.title, item.count]);
    });

    const options = {
      is3D: true,
      width: '80%',
      height: '350',
      tooltip: { isHtml: true },
      backgroundColor: { fill: 'transparent' },
      colors: ['#FC8EAC', '#00dcdc', '#ffc772'],
      legend: { position: 'bottom' },
    };
    const chart = new google.visualization.PieChart(document.getElementById('interview-summary-by-hiring-rate-pie-chart'));
    chart.draw(dataTable, options);
    const indices = data.length;
    const y: number[] = data.map(item => item.count / total * 100);
    let i = 0;
    let totalPiePercent = 0;
    const handler = setInterval(() => {
      for (i = 0; i < indices; i++) {
        totalPiePercent += (y[i] / 100);
        if (i === 0) {
          dataTable.setValue(i, 1, totalPiePercent);
        }
        else {
          dataTable.setValue(i, 1, y[i]);
        }
      }
      chart.draw(dataTable, options);
      if (totalPiePercent > y[0]) {
        dataTable.removeRows(0, dataTable.getNumberOfRows());
        data.forEach(item => {
          total += item.count;
          dataTable.addRow([item.title, item.count]);
        });
        chart.draw(dataTable, options);
        clearInterval(handler);
      }

    }, 10);
  }
  getInterviewSummaryByHiringRate(): void {
    this.isLoading = true;
    this.dashboardService.getInterviewSummaryByHiringRate().subscribe((response: any) => {
      if (response.response) {
        if (response.data.selectedInterviewee > 0 || response.data.notSelectedInterviewee > 0 || response.data.notConfirmed > 0) {
          this.data = [
            { title: 'Hired', count: response.data.selectedInterviewee },
            { title: 'Not hired', count: response.data.notSelectedInterviewee },
            { title: 'Not confirmed', count: response.data.notConfirmed }
          ];
        }
      } else {
        this.notifyService.showError(response.message, 'Failed');
      }
    },
      (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      }).add(
        () => {
          try {
            this.drawChart(this.data);
          } catch (e) { }
          this.isLoading = false;
        });
  }

}
