CREATE DATABASE IF NOT EXISTS portofolio_dashboard;
USE portofolio_dashboard;

CREATE TABLE penerbangan_100k (
    id_transaksi        INT PRIMARY KEY,
    nama_penumpang       VARCHAR(50),
    kota_asal            VARCHAR(30),
    kota_tujuan          VARCHAR(30),
    rute                 VARCHAR(10),
    maskapai             VARCHAR(30),
    kelas                VARCHAR(15),
    tanggal_pemesanan    DATE,
    tanggal_terbang      DATE,
    harga_tiket          INT,
    agent                VARCHAR(30),
    metode_pembayaran    VARCHAR(20),
    status_pemesanan     VARCHAR(15)
);

SELECT COUNT(*) FROM penerbangan_100k;

TRUNCATE TABLE penerbangan_100k;

SHOW DATABASES;
DROP DATABASE csv_db_8;
DROP DATABASE csv_db_9;
DROP DATABASE csv_db_10;
DROP DATABASE csv_db_11;