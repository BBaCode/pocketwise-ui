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
  datasets: any[] = [];
  documentStyle: any;

  @Input() months: string[] = [];
  @Input() totals: number[] = [];
  @Input() incomeTotals: number[] = [];
  @Input() isSpendView: boolean = false;
  @Output() barClicked: EventEmitter<string> = new EventEmitter<string>();

  async ngOnInit() {
    this.documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = this.documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder =
      this.documentStyle.getPropertyValue('--surface-border');

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

  private initializeChart() {
    this.initializeDataSets();
    this.data = {
      labels: this.months,
      datasets: this.datasets,
    };
  }

  private initializeDataSets() {
    this.datasets = [];
    this.datasets.push({
      label: 'Monthly Spending',
      backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
      data: this.totals,
    });
    if (!this.isSpendView) {
      this.datasets.push({
        label: 'Income',
        backgroundColor: this.documentStyle.getPropertyValue('--green-500'),
        data: this.incomeTotals,
      });
    }
  }
}
