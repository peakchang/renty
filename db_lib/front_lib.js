

/** 숫자 카운트 **/
const counter = ($counter, max, rapid) => {
    let now = max;
    const handle = setInterval(() => {
        $counter.innerHTML = numberWithCommas(Math.ceil(max - now));

        // 목표수치에 도달하면 정지
        if (now < 1) {
            clearInterval(handle);
        }
        
        // 증가되는 값이 계속하여 작아짐
        const step = now / 10;

        // 값을 적용시키면서 다음 차례에 영향을 끼침
        now -= step;
    }, rapid);
}


/** 세자리 콤마 **/
numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}