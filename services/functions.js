export function calcularCorrecao(dtInicial, dtFinal, valor, historicoInflacao){
    const[ mesInicial, anoInicial] = dtInicial.split("/").map(Number);
    const[ mesFinal, anoFinal] = dtFinal.split("/").map(Number);

    const periodoInicio = anoInicial * 12 + mesInicial;
    const periodoFinal = anoFinal * 12 + mesFinal;

    var periodoFilter = historicoInflacao.filter(item => {
        const data = Number(item.ano) * 12 + Number(item.mes);

        return data >= Number(periodoInicio) && data <= Number(periodoFinal);
    });

    const fatorAcumulador = periodoFilter.reduce((acumulador, item) => {
        return acumulador * (1 + item.ipca / 100);
    }, 1);

    const valorCorrigido = valor * fatorAcumulador;

    return valorCorrigido;
}

export function calcularPercentual(dtInicial, dtFinal, valor, historicoInflacao){
    const[ mesInicial, anoInicial] = dtInicial.split("/").map(Number);
    const[ mesFinal, anoFinal] = dtFinal.split("/").map(Number);

    const periodoInicio = anoInicial * 12 + mesInicial;
    const periodoFinal = anoFinal * 12 + mesFinal;

    var periodoFilter = historicoInflacao.filter(item => {
        const data = Number(item.ano) * 12 + Number(item.mes);

        return data >= Number(periodoInicio) && data <= Number(periodoFinal);
    });

    const fatorAcumulador = periodoFilter.reduce((acumulador, item) => {
        return acumulador * (1 + item.ipca / 100);
    }, 1);

    //Cálculo do percentual
    return (fatorAcumulador - 1) * 100; 
}