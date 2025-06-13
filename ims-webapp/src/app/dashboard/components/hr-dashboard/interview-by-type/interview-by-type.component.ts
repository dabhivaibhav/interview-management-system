import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-interview-by-type',
  templateUrl: './interview-by-type.component.html',
  styleUrls: ['./interview-by-type.component.css']
})
export class InterviewByTypeComponent implements OnInit {

  data: any[] = [];
  isLoading = false;

  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) { }

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getInterviewByType());
  }

  getInterviewByType(): void {
    this.isLoading = true;
    this.dashboardService.getInterviewByType().subscribe((response: any) => {
      if (response.response) {
        this.data = response.data;
        this.isLoading = false;
      } else {
        this.notifyService.showError(response.message, 'Failed');
        this.isLoading = false;
      }
    },
      (error) => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      },
    ).add(() => {
      try {
        this.drawChart(this.data);
      }
      catch (e) {

      }
    });
  }

  drawChart(data: any[] = []): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Type');
    dataTable.addColumn('number', 'Interviews');
    data.forEach(item => {
      dataTable.addRow([item.typeName, item.interviewCount]);
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
        title: 'Interview Type',
        titleTextStyle: { italic: false }
      },
      vAxis: {
        title: 'No. Of Interviews',
        titleTextStyle: { italic: false }
      },
    };

    const chart = new google.visualization.BarChart(document.getElementById('interviewe-by-type'));
    chart.draw(dataTable, options);
  }
}
