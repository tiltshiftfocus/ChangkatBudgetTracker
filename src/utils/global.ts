export const sortBy = (key: any, mode: 'asc' | 'desc' = 'asc') => {
    if (mode === 'desc') {
        return (a: any, b: any) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);
    }
    return (a: any, b: any) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

export const chartCurrencyTooltip: any = {
    plugins: {
        tooltip: {
            callbacks: {
                label: function(context: any) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y && context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SGD', currencyDisplay: 'narrowSymbol' }).format(parseFloat(context.parsed.y));
                    } else if (context.parsed && context.parsed !== null) {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SGD', currencyDisplay: 'narrowSymbol' }).format(parseFloat(context.parsed));
                    }
                    return label;
                }
            }
        }
    }
}