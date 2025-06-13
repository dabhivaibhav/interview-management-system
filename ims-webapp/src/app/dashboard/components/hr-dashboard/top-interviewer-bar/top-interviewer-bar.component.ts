import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;
@Component({
  selector: 'app-top-interviewer-bar',
  templateUrl: './top-interviewer-bar.component.html',
  styleUrls: ['./top-interviewer-bar.component.css']
})

export class TopInterviewerBarComponent implements OnInit {
  data: any[] = [];
  isLoading = false;
  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) { }
  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getTopInterviewers());

  }

  drawChart(data: any[] = []): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'InterviewerName');
    dataTable.addColumn('number', 'Interviews');

    data.forEach(item => {
      dataTable.addRow([item.interviewerName, item.interviewCount]);
    });

    const options = {
      height: '350',
      width: '80%',
      orientation: 'horizontal',
      backgroundColor: { fill: 'transparent' },
      animation: {
        duration: 1000,
        startup : true,
        easing: 'linear',
      },
      colors: ['#916dd1'],
      hAxis: {
        title: 'Interviewer Name',
        titleTextStyle: { italic: false }
      },
      vAxis: {
        title: 'No. Of Interviews',
        titleTextStyle: { italic: false }
      },
    };

    const chart = new google.visualization.BarChart(document.getElementById('top-interviewer-bar-chart'));
    chart.draw(dataTable, options);
  }

  getTopInterviewers(): void {
    this.isLoading = true;
    this.dashboardService.getTopInterviewers().subscribe((response: any) => {
      if (response.response) {
        this.data = response.data;
      } else {
        this.notifyService.showError(response.message, 'Failed');
      }
    },
      (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      },
    ).add(() => {
      try {
        this.drawChart(this.data);
      }
      catch (e) { }
      this.isLoading = false;
    });
  }
}



