import { Component, OnInit } from '@angular/core';
import { InterviewerDashboardService } from 'src/app/dashboard/service/interviewer-dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-interview-month-status-pie-chart',
  templateUrl: './interview-month-status-pie-chart.component.html',
  styleUrls: ['./interview-month-status-pie-chart.component.css']
})
export class InterviewMonthStatusPieChartComponent implements OnInit {

  constructor(
    private interviewerDashboardService: InterviewerDashboardService,
    private notifyService: NotificationService) {
    this.drawInterviewMonthStatusPieChart = this.drawInterviewMonthStatusPieChart.bind(this);
  }

  dataArray: any[] = [['Interview', 'Status']];
  isLoading = false;
  isDataAvailable = true;

  ngOnInit(): void {
    this.getInterviewsCurrentMonthStatus();
  }

  drawInterviewMonthStatusPieChart(): void {
    if (this.dataArray.length > 1) {
      let data = google.visualization.arrayToDataTable(this.dataArray);
      let statuses: any[] = [];
      this.dataArray.map((item) => {
        statuses.push(item[1]);
      });
      statuses = statuses.slice(1);
      const options = {
        is3D: true,
        width: '80%',
        height: '335',
        backgroundColor: { fill: 'transparent' },
        colors: ['#9c7bd5', '#FC8EAC', '#00dcdc', '#ffc772', '#6edb59'],
        legend: { position: 'bottom' }
      };

      const chart = new google.visualization.PieChart(document.getElementById('interview-status-pie-chart'));
      chart.draw(data, options);

      const indices = this.dataArray.length - 1;
      let total = 0;
      statuses.map(item => total += item);
      statuses.sort((a, b) => b - a);
      const y: number[] = statuses.map((item) => item / total * 100);
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

  getInterviewsCurrentMonthStatus(): void {
    this.isLoading = true;
    this.interviewerDashboardService.getInterviewsCurrentMonthStatus().subscribe((response: any) => {
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
        google.charts.setOnLoadCallback(this.drawInterviewMonthStatusPieChart);
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

  convertToappropriatedStatus(status: string): string {
    const monthMap: { [key: string]: string } = {
      SCHEDULED: 'Scheduled',
      INPROGRESS: 'In-Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      PENDING: 'Pending'
    };
    return monthMap[status] || status;
  }

}
