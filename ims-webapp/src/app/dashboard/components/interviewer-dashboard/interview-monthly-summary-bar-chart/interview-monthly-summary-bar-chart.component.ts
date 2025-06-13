import { Component, OnInit } from '@angular/core';
import { InterviewerDashboardService } from 'src/app/dashboard/service/interviewer-dashboard.service';
import { NotificationService } from 'src/app/notification.service';
declare var google: any;

@Component({
  selector: 'app-interview-monthly-summary-bar-chart',
  templateUrl: './interview-monthly-summary-bar-chart.component.html',
  styleUrls: ['./interview-monthly-summary-bar-chart.component.css']
})
export class InterviewMonthlySummaryBarChartComponent implements OnInit {

  constructor(
    private interviewerDashboardService: InterviewerDashboardService,
    private notifyService: NotificationService
  ) {
    this.drawInterviewBarChart = this.drawInterviewBarChart.bind(this);
  }

  dataArray: any[] = [['Month', 'Interview']];
  isLoading = false;

  ngOnInit(): void {
    this.getInterviewOfYearByMonth();
  }

  getInterviewOfYearByMonth(): void {
    this.isLoading = true;
    this.interviewerDashboardService.getInterviewOfYearByMonth().subscribe((response: any) => {
      if (response.response) {
        if (response.data) {
          const data = response.data;
          if (Object.keys(data).length > 0) {
            Object.keys(data).forEach(month => {
              this.dataArray.push([this.convertToAbbreviatedMonth(month), data[month]]);
            });
          }
        }
        google.charts.load('current', { packages: ['bar'] });
        google.charts.setOnLoadCallback(this.drawInterviewBarChart);
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

  drawInterviewBarChart = () => {
    const data = google.visualization.arrayToDataTable(this.dataArray);

    const options = {
      height: '350',
      width: '80%',
      colors: ['#916dd1'],
      series: {
        0: { axis: 'interview' }
      },
      axes: {
        y: {
          interview: { label: 'No. Of Interviews' }
        }
      }
    };

    const chart = new google.charts.Bar(document.getElementById('interview-bar-chart'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
  }

  convertToAbbreviatedMonth(fullMonthName: string): string {
    const monthMap: { [key: string]: string } = {
      JANUARY: 'JAN',
      FEBRUARY: 'FEB',
      MARCH: 'MAR',
      APRIL: 'APR',
      MAY: 'MAY',
      JUNE: 'JUN',
      JULY: 'JUL',
      AUGUST: 'AUG',
      SEPTEMBER: 'SEP',
      OCTOBER: 'OCT',
      NOVEMBER: 'NOV',
      DECEMBER: 'DEC'
    };
    return monthMap[fullMonthName.toUpperCase()] || fullMonthName;
  }


}
