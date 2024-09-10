class BloomFilter {
    constructor(size) {
        this.size = size;
        this.bitArray = new Array(size).fill(0);
        this.hashFunctions = [
            (str) => this.hash1(str),
            (str) => this.hash2(str),
            (str) => this.hash3(str)
        ];
    }

    // Fungsi Hash dengan variasi untuk mengurangi collision
    hash1(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33 + str.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    hash2(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    hash3(str) {
        let hash = 7;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 101 + str.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    add(element) {
        this.hashFunctions.forEach((hashFunc) => {
            const position = hashFunc(element);
            this.bitArray[position] = 1;
        });
        this.updateBitArray();
    }

    check(element) {
        let exists = true;
        this.hashFunctions.forEach((hashFunc, index) => {
            const position = hashFunc(element);
            if (this.bitArray[position] === 0) {
                exists = false;
            }
        });
        return exists;
    }

    updateBitArray() {
        const bitArrayDiv = document.getElementById("bitArray");
        bitArrayDiv.innerHTML = '';
        this.bitArray.forEach((bit, index) => {
            const bitElement = document.createElement("div");
            bitElement.classList.add("bit");
            if (bit === 1) bitElement.classList.add("active");
            bitElement.textContent = bit;
            bitArrayDiv.appendChild(bitElement);
        });
    }
}

// Algoritma Hash Set
class HashSet {
    constructor() {
        this.set = new Set();
    }

    add(element) {
        this.set.add(element);
    }

    check(element) {
        return this.set.has(element);
    }
}

// Algoritma Linear Array Search
class ArraySearch {
    constructor() {
        this.array = [];
    }

    add(element) {
        this.array.push(element);
    }

    check(element) {
        return this.array.includes(element);
    }
}

// Inisialisasi Bloom Filter, Hash Set, dan Array Search
const bloomFilter = new BloomFilter(30);
const hashSet = new HashSet();
const arraySearch = new ArraySearch();
const results = []; // Array untuk menyimpan hasil

// Fungsi untuk menghitung waktu eksekusi
function measureTime(callback, iterations = 1000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        callback();  // Jalankan callback berulang kali
    }
    const end = performance.now();
    const totalTime = (end - start) / iterations;  // Waktu rata-rata per iterasi
    return totalTime;
}


// Handle adding elements
function addElement() {
    const element = document.getElementById("element").value;
    if (element) {
        bloomFilter.add(element);
        hashSet.add(element);
        arraySearch.add(element);
        const resultMessage = `Added "${element}" to Bloom Filter, Hash Set, and Array Search.`;
        results.push(resultMessage); // Simpan hasil
        updateResult(); // Perbarui hasil yang ditampilkan
        document.getElementById("element").value = '';
    }
}

// Handle checking elements
function checkElement() {
    const element = document.getElementById("element").value;
    if (element) {
        const iterations = 1000; // Jumlah iterasi untuk pengukuran waktu

        // Measure time for Bloom Filter
        const bloomTime = measureTime(() => bloomFilter.check(element), iterations);
        const bloomMessage = `"${element}" in Bloom Filter: ${bloomFilter.check(element) ? "might exist" : "definitely does not exist"}. (Avg Time: ${bloomTime.toFixed(4)} ms)`;

        // Measure time for Hash Set
        const hashSetTime = measureTime(() => hashSet.check(element), iterations);
        const hashSetMessage = `"${element}" in Hash Set: ${hashSet.check(element) ? "exists" : "does not exist"}. (Avg Time: ${hashSetTime.toFixed(4)} ms)`;

        // Measure time for Array Search
        const arraySearchTime = measureTime(() => arraySearch.check(element), iterations);
        const arraySearchMessage = `"${element}" in Array Search: ${arraySearch.check(element) ? "exists" : "does not exist"}. (Avg Time: ${arraySearchTime.toFixed(4)} ms)`;

        // Simpan hasil
        results.push(bloomMessage, hashSetMessage, arraySearchMessage);
        updateResult(); // Perbarui hasil yang ditampilkan
        document.getElementById("element").value = '';
    }
}


// Fungsi untuk memperbarui tampilan hasil
function updateResult() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = results.join('<br>'); // Tampilkan semua hasil yang disimpan
}
