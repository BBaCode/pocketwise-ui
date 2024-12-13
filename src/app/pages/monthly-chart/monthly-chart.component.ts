import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-monthly-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.scss'],
})
export class MonthlyChartComponent implements OnInit {
  data: any;
  options: any;

  @Input() months: any;
  @Input() totals: any;
  @Output() barClicked: EventEmitter<string> = new EventEmitter<string>();

  async ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
        },
        decimation: {
          enabled: true,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
      onClick: (event: any, elements: any) => this.handleClick(event, elements),
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if months and totals are updated and both are available
    if (this.months && this.totals) {
      this.initializeChart();
    }
  }

  private initializeChart() {
    this.data = {
      labels: this.months,
      datasets: [
        {
          label: 'Monthly Spending',
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)',
          ],
          data: this.totals,
        },
      ],
    };
  }

  handleClick(event: any, elements: any) {
    console.log(event, elements);
    console.log('handle click');
    if (elements.length > 0) {
      const index = elements[0].index; // Get the index of the clicked bar
      const month = this.months[index]; // Get the corresponding month
      console.log(month);
      this.barClicked.emit(month); // Emit the clicked month to the parent
    }
  }

  backgroundColor() {
    const backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)',
    ];
    return backgroundColor.slice(0, this.months.length);
  }
}
