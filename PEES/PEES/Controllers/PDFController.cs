using System;
using Microsoft.AspNetCore.Mvc;
using IronPdf;
using Microsoft.AspNetCore.Hosting;

namespace PEES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase
    {
        private readonly string pathOutput;

        public PDFController(IWebHostEnvironment environment)
        {
            pathOutput = String.Concat(environment.ContentRootPath, environment.EnvironmentName.ToLower() == "development" ? "\\clientApp\\public\\out" : "\\clientapp\\build\\out");
        }

        [HttpPut("{id}")]
        public IActionResult Get(string id, [FromBody] string str)
        {
            var Renderer = new HtmlToPdf();
            Renderer.PrintOptions.ViewPortWidth = 1280;
            Renderer.PrintOptions.EnableJavaScript = true;
            Renderer.PrintOptions.PaperSize = PdfPrintOptions.PdfPaperSize.A4;
            Renderer.PrintOptions.CssMediaType = PdfPrintOptions.PdfCssMediaType.Print;

            // clean up
            str = str.Replace("<header class=\"header\"><nav class=\"navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 navbar navbar-light\"><div class=\"container\"><a class=\"navbar-brand\" href=\"/\"><img src=\"/images/logo.png\" alt=\"Logo\" width=\"32\"> Plataforma de Enunciados Escolares</a></div></nav></header>", "");
            str = str.Replace("<div class=\"content container\" style=\"top: 60px;\">", "<div class=\"content container\" style=\"top: 20px;\">");
            str = str.Replace("<div class=\"text-center\"><button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Gerar PDF</button></div>", "");

            var PDF = Renderer.RenderHtmlAsPdf(String.Concat("<!DOCTYPE html><html lang=\"en\">", str, "</html>"));
            PDF.SaveAs(string.Concat(pathOutput, "\\", id, ".pdf"));

            return new JsonResult(string.Concat("/out/", id, ".pdf"));
        }
    }
}
