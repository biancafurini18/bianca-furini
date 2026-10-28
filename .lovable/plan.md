# Conectar o projeto ao GitHub

Eu não consigo conectar o GitHub nem confirmar a sincronização por aqui. A conexão precisa da sua autorização na sua conta do GitHub, e você faz isso no próprio Lovable. Nenhuma mudança no código é necessária.

## Passos (você)

1. Desktop: clique no nome do projeto, no canto superior esquerdo, e vá em **Settings -> Git**. Outro caminho: botão **+** ao lado do chat -> **Project -> GitHub**.
   Celular: modo Chat -> **+** -> **Project -> GitHub**.
2. Clique em **Connect** e autorize o **Lovable GitHub App** na sua conta.
3. Escolha a conta ou organização onde o repositório vai ficar. O Lovable cria um repositório **novo e privado**. Não dá para ligar um repositório que já existe.

## Como confirmar a sincronização nos dois sentidos

- **Lovable -> GitHub:** depois de conectar, o código atual aparece no repositório. Cada nova alteração feita aqui vira um commit no branch sincronizado (normalmente `main`).
- **GitHub -> Lovable:** faça um push de um commit pequeno no `main` (por exemplo, editar o README). A alteração aparece no Lovable em alguns instantes.
- A tela **Settings -> Git** mostra o status. Se ela disser que o GitHub está N commits à frente, faça mais um push no `main`.

## Cuidados

- Só o branch sincronizado entra no Lovable. Outros branches precisam ser mesclados nele.
- Evite force-push ou rebase no `main`, porque isso substitui a versão do Lovable.
- Arquivos acima de 100 MB são rejeitados pelo GitHub.

Quando estiver conectado, me avise que eu sigo com as próximas alterações normalmente.
