# Game Server Emulator for Son Silah (S2)

Bu proje, Son Silah (S2) oyunu için geliştirilmiş bir oyun sunucu emülatörüdür. Bu emülatör, oyunun bazı temel fonksiyonlarını taklit eder ve oyunun sunucu tarafındaki iletişimi yönetir.

## İndirilmesi Gerekenler.
- **TheRaw.Exe** https://s2.dosya.tc/server31/px4l3u/TheRaw.exe.html
- **Start.Bat** Start TheRaw.exe -arch game +windowed 1 -windowtitle "S2 Son Silah" +EnablePrefetch 1  +gs_ip 127.0.0.1 +gs_port 12000 +FlashDevMode 1.0 +ShowLog 1.0 +DediLog 1.0 +FlashRecieveLog 1.0 -noextra

## Özellikler

- **Kullanıcı Giriş:** Kullanıcı adı ve şifre ile kullanıcı doğrulaması yapar.
- **Sunucu Listesi:** Bağlanılabilir sunucuların listesini sağlar.
- **Komut Satırı Kontrolü:** Sunucuyu komut satırından yönetebilmek için konsol komutları sağlar.

## Bağımlılıklar

- Node.js
- uuid
- winston

## Başlatma

Sunucuyu başlatmak için aşağıdaki adımları izleyin:

1. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

2. Sunucuyu başlatın:
    ```bash
    node server.js
    ```

## Proje Yapısı

- `Packet` sınıfı: Gelen veri paketlerini işler.
- `GameServer` sınıfı: Sunucu bağlantılarını yönetir ve gelen verileri işler.
- `GameClient` sınıfı: Bağlı olan istemciyi temsil eder.
- `GameDatabase` sınıfı: Kullanıcı doğrulamasını yapar ve kullanıcı bilgilerini yönetir.

## Komutlar

- `userlist`: Bağlı olan kullanıcıların listesini gösterir.

---

## Önemli Notlar

- **CN (Client Notify):** İstemci bildirimleri.
- **SN (Server Notify):** Sunucu bildirimleri.
- **CQ (Client Query):** İstemci sorguları.
- **SA (Server Answer):** Sunucu yanıtları.
- **NN (Client/Server Notify):** İstemci/Sunucu bildirimleri.

Bu iki satır kod hata kodu ve hata sebebini temsil eder:
```js
writeUInt16LE(0, 6);
writeUInt32LE(0, 8);
```
**Giriş Başarısız:** 0x210102
---

## Fotoğraflar
Kullanıcı adı veya şifre yanlış girildiğinde aşağıdaki hata mesajını alırsınız:
![image](https://github.com/user-attachments/assets/6a7d0399-903a-4a46-a351-87d4134ddadc)

![image](https://github.com/user-attachments/assets/e4b7d274-dc3c-429a-a6b3-06b3df667ef2)

![image](https://github.com/user-attachments/assets/2d8a4435-1403-4e4d-8f70-66054d31276e)

---
## Lisans

MIT lisansı altında lisanslıdır, daha fazla bilgi için LICENSE konusuna bakın.

Bu projenin Joygame ile bağlantısı yoktur. S2 Son Silah bu şirkete aittir.
