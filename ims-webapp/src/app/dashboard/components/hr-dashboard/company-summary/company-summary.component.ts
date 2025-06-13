import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;
@Component({
  selector: 'app-company-summary',
  templateUrl: './company-summary.component.html',
  styleUrls: ['./company-summary.component.css']
})
export class CompanySummaryComponent implements OnInit {
  data: any[] = [];
  isLoading = false;
  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) { }
  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.getIntervieweeSummaryByCompany());

  }

  drawChart = (data: any[] = []): void =>  {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'CompanyName');
    dataTable.addColumn('number', 'Interviewees');

    data.forEach(item => {
      dataTable.addRow([item.companyName, item.intervieweeCount]);
    });

    const options = {
      height: '350',
      width: '80%',
      orientation: 'horizontal',
      colors: ['#916dd1'],
      backgroundColor: { fill: 'transparent' },
      animation: {
        duration: 1000,
        startup: true,
        easing: 'linear',
      },
      hAxis: {
        title: 'Company Name',
        titleTextStyle: { italic: false }
      },
      vAxis: {
        title: 'No. Of Interviewees',
        titleTextStyle: { italic: false }
      },
    };

    const chart = new google.visualization.BarChart(document.getElementById('interviewee-summary-by-company-interviewer-bar-chart'));
    chart.draw(dataTable, options);
  }

  getIntervieweeSummaryByCompany = (): void => {
    this.isLoading = true;
    this.dashboardService.getIntervieweeSummaryByCompany().subscribe((response: any) => {
      if (response.response) {
        this.data = response.data;
      } else {
        this.notifyService.showError(response.message, 'Failed');
      }
    },
      (error: any) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      }).add(
        () => {
          try {
            this.drawChart(this.data);
          } catch (e) { }
          this.isLoading = false;
        }
      );
  }
}
