export class Env {
    public IP_FRONTEND?:any = "http://192.168.10.51:3389";
    public PORT?:number =  9851;
    private LOCALHOST?: "0.0.0.0";
    private HOST_DB?: string = "192.168.10.11\\SQL2017";
    private NAME_DB?: string = "ARTDECON";
    private PASS_DB?: string = "sql2017EXadmin";
    private USER_DB?: string = "sa";
    private PORT_DB?: number = 1433;
    public SEED_TOKEN?: string =
      "esta_es_la_mama_de_las_comtraseñas_lista_para_no_dejar_pasar_a_nafien";
    private APIKEY?: "9e86ca80d2834a6096bf9bc5e2066f07";
    private urlAPI?: "https://api.geoapify.com/v1/geocode/reverse?";
      
    
    public configSQL: any = {
        server: this.HOST_DB,
        user: process.env.USER_DB || this.USER_DB,
        password: process.env.PASS_DB || this.PASS_DB,
        database: process.env.DATABASE || this.NAME_DB,
        port: this.PORT_DB,
        options: {
            encrypt: false,
            enableArithAbort: true
        }
    }
}