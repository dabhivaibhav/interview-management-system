import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-status-summary',
  templateUrl: './status-summary.component.html',
  styleUrls: ['./status-summary.component.css']
})
export class StatusSummaryComponent implements OnInit {
  isLoading = false;
  data: any = {
    SCHEDULED: 0,
    INPROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    PENDING: 0
  };
  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) { }
  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getInterviewSummaryByStatus());
  }

  drawChart(data: any = {}): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Statuses');
    dataTable.addColumn('number', 'Interviews');
    const statusArray = Object.entries(data);
    statusArray.forEach(item => {
      dataTable.addRow([item[0], item[1]]);
    });

    const options = {
      width: '80%',
      height: '350',
      orientation: 'horizontal',
      colors: ['#916dd1'],
      backgroundColor: { fill: 'transparent' },
      animation: {
        duration: 1000,
        startup : true,
        easing: 'linear',
      },

      hAxis: {
        title: 'Status',
        titleTextStyle: { italic: false }
      },
      vAxis: {
        title: 'No. Of Interviews',
        titleTextStyle: { italic: false }
      },
    };

    const chart = new google.visualization.BarChart(document.getElementById('interview-summary-by-status-interviewer-bar-chart'));
    chart.draw(dataTable, options);
  }

  getInterviewSummaryByStatus(): void {
    this.isLoading = true;
    this.dashboardService.getInterviewSummaryByStatus().subscribe((response: any) => {
      if (response.response) {
        const responseData = response.data.reduce((acc: { [x: string]: any; }, { interviewStatus, interviewCount }: any) => {
          acc[interviewStatus] = interviewCount;
          return acc;
        }, {});
        this.data = { ...this.data, ...responseData };
      } else {
        this.notifyService.showError(response.message, 'Failed');
      }
    },
      (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      }).add(() => {
        try {
          this.drawChart(this.data);
        } catch (e) { }
        this.isLoading = false;
      });
  }
}
