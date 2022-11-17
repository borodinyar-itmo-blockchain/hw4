#  HW4

## Запуск тестов

1. Добавить файл .env и записать туда  адрес ноды 
```
ALCHEMY_TOKEN=<API KEY>
```
2. Установть зависимости
```
npm install
```
3. Запустить команду
```
npx hardhat test
```

## Пример вывода

```
Balabce BYT before swap: 1000000000000000000
Balabce TUSD before swap: 0
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
BYT swap to TUSD
Reserves changes:  BigNumber { value: "12000000000000000000" }  ->  BigNumber { value: "11079479879972301301" }
Reserves changes:  BigNumber { value: "12000000000000000000" }  ->  BigNumber { value: "13000000000000000000" }
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Balabce BYT after swap: 0
Balabce TUSD after swap: 920520120027698699
    ✔ Swap TUSD and BYT (10263ms)


  1 passing (10s)
```
