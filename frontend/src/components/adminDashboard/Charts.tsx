
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
    ChartOptions
} from 'chart.js'; 
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    Filler,
    LineElement
);

interface BarChartProps {
    data_1: number[],
    data_2: number[],
    title_1: string,
    title_2: string,
    bgColor_1: string,
    bgColor_2: string,
    labels?: string[],
    horizontal?: boolean
}


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const BarChart = ({ data_1 = [], data_2 = [], title_1, title_2, bgColor_1, bgColor_2, horizontal = false, labels = months }: BarChartProps) => {
    // Options
    const options: ChartOptions<"bar"> = {
        responsive: true,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
            legend: {
                display: false,
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Data
    const data: ChartData<"bar", number[], string> = {
        labels,
        datasets: [
            {
                label: title_1,
                data: data_1,
                backgroundColor: bgColor_1,
                barThickness: "flex",
                barPercentage: 1,
                categoryPercentage: 0.4
            },
            {
                label: title_2,
                data: data_2,
                backgroundColor: bgColor_2,
                barThickness: "flex",
                barPercentage: 1,
                categoryPercentage: 0.4
            },
        ],
    };

    return <Bar width={horizontal ? "200%" : ""} options={options} data={data} />;
}



interface DoughnutChartProps {
    labels: string[],
    data: number[],
    bgColor: string[],
    cutout?: number | string, // sector of chart is outside
    offset?: number[], // how much the sector is outside
    legends?: boolean, // legend for chart
}

export const DoughnutChart = ({ labels, data, bgColor, cutout, legends = true, offset }: DoughnutChartProps) => {
    // Data
    const doughnutData: ChartData<"doughnut", number[], string> = {
        labels,
        datasets: [{
            data,
            backgroundColor: bgColor,
            borderWidth: 0,
            offset
        }]
    };

    // Options
    const doughnutOptions: ChartOptions<"doughnut"> = {
        responsive: true,
        plugins: {
            legend: {
                display: legends,
                position: "bottom",
                labels: {
                    padding: 40,
                },
            },
        },
        cutout
    };

    return <Doughnut data={doughnutData} options={doughnutOptions} />
}



interface PieChartProps {
    labels: string[],
    data: number[],
    bgColor: string[],

    offset?: number[], // how much the sector is outside

}
export const PieChart = ({ labels, data, bgColor, offset }: PieChartProps) => {
    // Data
    const pieData: ChartData<"pie", number[], string> = {
        labels,
        datasets: [{
            data,
            backgroundColor: bgColor,
            borderWidth: 1,
            offset
        }]
    };

    // Options
    const pieOptions: ChartOptions<"pie"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    padding: 40,
                },
            },
        },
    };

    return <Pie data={pieData} options={pieOptions} />
}

interface LineChartProps {
    data: number[],
    label: string,
    bgColor: string,
    borderColor: string,
    labels?: string[],
}



export const LineChart = ({ data, label, bgColor, borderColor,labels=months }: LineChartProps) => {
    // Options
    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Data
    const LineChartData: ChartData<"line", number[], string> = {
        labels,
        datasets: [
            {
                fill: true,
                label,
                data,
                backgroundColor: bgColor,
                borderColor: borderColor
            }
        ],
    };

    return <Line options={options} data={LineChartData} />;
}
