import { User } from '../models/User';

export let user: User[] = [
    {name: "player", password: "48267ed2a9f0bb144a391d73a378c6e5c3cfa1f33e0b026fe2d817f638709bbe7aaeb296d4b9706138273c0a5a1287b8608588417f3ca1a60b1fe9fe69d50d6c", salt : "c1c4804fd54dd8c10035fc58731cdcb6", roles: ["player"]},
    {name: "admin", password: "4775247c5925131cfd229d775db7162e0ff30547dfa50669655f535675a614ef6b0c01241d9540447475be8e9b7df772e6e19ea41f09588a5b6cf2e0c3dcace3", salt : "81dbca95d2ece3e3293b629f445a7a89", roles: ["admin"]},
    {name: "reto", password: "096b0e0093efaf78614f8f4c40becbe9d454f45c198910b8bd2217b1d9b597fbb140b7f6e13af9db86f97f335df851b84ac02a956bf5ead67b53336658a8457e", salt : "0371eb94fb03d13b62cde06ecad6106a", roles: ["player", "admin"]},
    {name: "sven", password: "1de00ee5b3786e96fdd500c4abc199f4e62f7ae344b7eed4457124ee9eff47923a27d91e16d9d2a32b70e33e37dab5c37e755ed5eac4823637fdf8241960df43", salt : "f9d872a8ff19414837a81737f3267dfb", roles: ["player", "admin"]},
    {name: "christoph", password: "cf49df14aa971df29b31f884fc7231577c4cd68952d2c218b511db2683cd60dba0c6b644f88e98ce3b0272c23b8838e8d13e188082bd677f3caa8d40d252fc4a", salt : "fd9315272480d9822cffa9d9453f3e83", roles: ["player", "admin"]},
    {name: "tobi", password: "29742aea93862c59a18f8d13670a9c5aaadfc24184374148588d2b3b72e9152146a5e8d5c5c65dc267da432849f0ef82b0df84b4afff9ae76e9ce2fd5b9839bd", salt : "cd25d23ac3ffbf9952c3261d363096e7", roles: ["player", "admin"]},
];


