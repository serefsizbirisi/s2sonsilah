# Game Server Emulator for Last Weapon (S2)

[Click here for Turkish version / Türkçe versiyon için buraya tıklayın](#son-silah-s2-için-oyun-sunucusu-emülatörü)

This project is a game server emulator developed for the Last Weapon (S2) game. This emulator mimics some of the basic functions of the game and manages the server-side communication of the game.

## Steps to Run the Server
- To run therawserver, you need to extract the game files
- To extract the game files, put [ArchiveExtractor.exe](https://s6.dosya.tc/server21/8ee83c/ArchiveExtractor.exe.html) in the Game folder and drag and drop the Game.Res00 file onto ArchiveExtractor.exe. After extraction, the files will be in the Extracted folder. Enter the folder, press ctrl-a, right-click, and select cut. Then go back and press ctrl-v. That's it.
- Go back and edit the Default.archcfg file, delete everything inside and just write Game.
- Download this [game.rar](https://s6.dosya.tc/server21/eibrvk/Game.rar.html), extract it and put the two files GameClient.dll and GameServer.dll in the game folder.
- Download [s2.rar](https://s2.dosya.tc/server31/ldi0p0/s2.rar.html), extract it and put its contents directly in the directory where theraw.exe is located.
- Then run LaunchServer.bat, then run Shell.exe, then open hooks.ct (Cheat Engine must be installed). When the Cheat Engine screen appears, select therawserver.exe and click on the boxes in the list.
- Then start the lobi.js server, therawserver.exe will connect directly. (You can start the login.js server afterwards.)

## Required Downloads
- **TheRaw.Exe** https://s2.dosya.tc/server31/px4l3u/TheRaw.exe.html
- **Start.Bat** Start TheRaw.exe -arch game +windowed 1 -windowtitle "S2 Last Weapon" +EnablePrefetch 1 +gs_ip 127.0.0.1 +gs_port 12000 +FlashDevMode 1.0 +ShowLog 1.0 +DediLog 1.0 +FlashRecieveLog 1.0 -noextra

## Important Notes
- **CN (Client Notify):** Client notifications.
- **SN (Server Notify):** Server notifications.
- **CQ (Client Query):** Client queries.
- **SA (Server Answer):** Server answers.
- **NN (Client/Server Notify):** Client/Server notifications.

These two lines of code represent the error code and error reason:
```js
writeUInt16LE(0, 6);
writeUInt32LE(0, 8);
```
- **Already Logged In:** 0x210101
- **Login Failed:** 0x210102
- **No Name Entered:** 0x210201
- **Contains Banned Word:** 0x210202
- **Name Too Short:** 0x210203
- **Name Too Long:** 0x210204
- **Already in Shop:** 0x240101

## Images
When an incorrect username or password is entered, you will receive the following error message:
![image](https://github.com/user-attachments/assets/6a7d0399-903a-4a46-a351-87d4134ddadc)
![image](https://github.com/user-attachments/assets/e4b7d274-dc3c-429a-a6b3-06b3df667ef2)
![image](https://github.com/user-attachments/assets/6a4e9f86-e6bc-4f94-af8b-42c90f6eed13)
![image](https://github.com/user-attachments/assets/5b76a785-3397-40b6-871c-1a2cc440c285)
![image](https://github.com/user-attachments/assets/7ec26525-1155-4738-a346-80a96fb78ae1)

## License
Licensed under the MIT license, see the LICENSE topic for more information.
This project has no connection with Joygame. S2 Last Weapon belongs to this company.

---

# Son Silah (S2) için Oyun Sunucusu Emülatörü

[Click here for English version / İngilizce versiyon için buraya tıklayın](#game-server-emulator-for-last-weapon-s2)

Bu proje, Son Silah (S2) oyunu için geliştirilmiş bir oyun sunucu emülatörüdür. Bu emülatör, oyunun bazı temel fonksiyonlarını taklit eder ve oyunun sunucu tarafındaki iletişimi yönetir.

## Serveri Çalıştırmak İçin Yapılması Gerekenler
- therawserver'in çalışması için oyunun dosyalarını çıkartmanız gerekiyor
- oyunun dosyalarını çıkartmak için Game Klasörüne [ArchiveExtractor.exe](https://s6.dosya.tc/server21/8ee83c/ArchiveExtractor.exe.html) Atıyorsunuz ve o klasör de olan Game.Res00 dosyasını ArchiveExtractor.exe üzerine sürükleyerek bırakıyorsunuz. dosyalar çıktıktan sonra Extracted klasörün içinde oluyor klasöre girip ctrl-a yap sağ tık yap sonra kes yazısına bas. sonra geri gelip ctrl-v tusuna bas bu kadar.
- geri gelip Default.archcfg dosyasını editliyorsunuz ve içideki herşeyi silip sadece Game yazıyorsunuz.
- bu verdiğim [game.rar](https://s6.dosya.tc/server21/eibrvk/Game.rar.html)'ı indir aç içinde verdiğim GameClient.dll GameServer.dll şu iki dosyayı game klasörüne at.
- [s2.rar](https://s2.dosya.tc/server31/ldi0p0/s2.rar.html) bu indir aç bunun içindekileri direkt theraw.exe'nin olduğu dizine atın.
- sonra LaunchServer.bat çalıştırın sonra Shell.exe çalıştırın sonra hooks.ct açın (cheat engine) kurulu olması lazım. cheat engine ekranı geldiğinde therawserver.exeyi seçip listedekli kutulara tıklamanız lazım.
- sonra lobi.js serveri başlatın therawserver.exe direkt bağlanacaktır. (sonrasında login.js serveri başlatabilirsiniz.)

## İndirilmesi Gerekenler
- **TheRaw.Exe** https://s2.dosya.tc/server31/px4l3u/TheRaw.exe.html
- **Start.Bat** Start TheRaw.exe -arch game +windowed 1 -windowtitle "S2 Son Silah" +EnablePrefetch 1  +gs_ip 127.0.0.1 +gs_port 12000 +FlashDevMode 1.0 +ShowLog 1.0 +DediLog 1.0 +FlashRecieveLog 1.0 -noextra

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
- **Zaten Giriş Yaptınız:** 0x210101
- **Giriş Başarısız:** 0x210102
- **İsim Girmediniz:** 0x210201
- **Yasaklı Kelime İçermektedir:** 0x210202
- **İsminiz Çok Kısa:** 0x210203
- **İsminiz Çok Uzun:** 0x210204
- **Zaten Dükkandasınız:** 0x240101

## Fotoğraflar
Kullanıcı adı veya şifre yanlış girildiğinde aşağıdaki hata mesajını alırsınız:
![image](https://github.com/user-attachments/assets/6a7d0399-903a-4a46-a351-87d4134ddadc)
![image](https://github.com/user-attachments/assets/e4b7d274-dc3c-429a-a6b3-06b3df667ef2)
![image](https://github.com/user-attachments/assets/6a4e9f86-e6bc-4f94-af8b-42c90f6eed13)
![image](https://github.com/user-attachments/assets/5b76a785-3397-40b6-871c-1a2cc440c285)
![image](https://github.com/user-attachments/assets/7ec26525-1155-4738-a346-80a96fb78ae1)

## Lisans
MIT lisansı altında lisanslıdır, daha fazla bilgi için LICENSE konusuna bakın.
Bu projenin Joygame ile bağlantısı yoktur. S2 Son Silah bu şirkete aittir.
