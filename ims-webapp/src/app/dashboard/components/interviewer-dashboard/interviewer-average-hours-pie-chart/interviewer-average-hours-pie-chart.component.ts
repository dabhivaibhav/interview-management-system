import { Component, OnInit } from '@angular/core';
import { InterviewerDashboardService } from 'src/app/dashboard/service/interviewer-dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-interviewer-average-hours-pie-chart',
  templateUrl: './interviewer-average-hours-pie-chart.component.html',
  styleUrls: ['./interviewer-average-hours-pie-chart.component.css']
})
export class InterviewerAverageHoursPieChartComponent implements OnInit {

  constructor(
    private interviewerDashboardService: InterviewerDashboardService,
    private notifyService: NotificationService) {
    this.drawInterviewerAverageHoursSpentPieChart = this.drawInterviewerAverageHoursSpentPieChart.bind(this);
  }

  dataArray: any[] = [['Status', 'Hours']];
  isLoading = false;
  isDataAvailable = true;

  ngOnInit(): void {
    this.getInterviewerSpendingHours();
  }

  getInterviewerSpendingHours(): void {
    this.isLoading = true;
    this.interviewerDashboardService.getInterviewerSpendingHours().subscribe((response: any) => {
      if (response.response) {
        if (response.data) {
          const data = response.data;
          if (Object.keys(data).length > 0) {
            Object.keys(data).forEach(status => {
              this.dataArray.push([this.convertToappropriatedStatus(status), data[status]]);
            });
          }
        }
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(this.drawInterviewerAverageHoursSpentPieChart);
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        this.notifyService.showError(response.message, 'Failed');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Failed');
      console.log(error);
    });
  }

  drawInterviewerAverageHoursSpentPieChart(): void {
    if (this.dataArray.length > 1) {
      let data = google.visualization.arrayToDataTable(this.dataArray);
      let hours: any[] = [];
      this.dataArray.map((item) => {
        hours.push(item[1]);
      });
      hours = hours.slice(1);
      const options = {
        is3D: true,
        width: '80%',
        height: '350',
        backgroundColor: { fill: 'transparent' },
        colors: ['#9c7bd5', '#ffc772'],
        legend: { position: 'bottom' }
      };

      const chart = new google.visualization.PieChart(document.getElementById('interviewer-average-hours-pie-Chart'));
      chart.draw(data, options);
      const indices = this.dataArray.length - 1;
      let total = 0;
      hours.map(item => total += item);
      hours.sort((a, b) => b - a);
      const y: number[] = hours.map((item) => item / total * 100);
      let i = 0;
      let totalPiePercent = 0;
      const handler = setInterval(() => {
        for (i = 0; i < indices; i++) {
          totalPiePercent += (y[i] / 100);
          if (i === 0) {
            data.setValue(i, 1, totalPiePercent);
          }
          else {
            data.setValue(i, 1, y[i]);
          }
        }
        chart.draw(data, options);
        if (totalPiePercent > y[0]) {
          data.removeRows(0, data.getNumberOfRows());
          data = google.visualization.arrayToDataTable(this.dataArray);
          chart.draw(data, options);
          clearInterval(handler);
        }
      }, 10);
    } else {
      this.isDataAvailable = false;
    }
  }

  convertToappropriatedStatus(status: string): string {
    const monthMap: { [key: string]: string } = {
      interviewSpentHours: 'Interview Hours',
      productiveHours: 'Productive Hours'
    };
    return monthMap[status] || status;
  }

}
