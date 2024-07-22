export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

export const statusDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { month: 'short', year: 'numeric' };

    // Mendapatkan tanggal saat ini
    const currentDate = new Date();

    // Menghitung perbedaan tahun dan bulan
    const diffYears = date.getFullYear() - currentDate.getFullYear() ;
    const diffMonths = date.getMonth() - currentDate.getMonth()  + diffYears * 12;

    // Status default
    let status = `success`;

    // Menentukan status berdasarkan perbedaan bulan
    if (diffMonths <= 1) {
        status = `warning`;
    } 
    
    if (date < currentDate) {
        status = 'failed';
    }

    // Mengembalikan tanggal dan status
    return status;
};

