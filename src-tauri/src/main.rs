#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use serde::{ Serialize, Deserialize };

#[tauri::command]
fn simple_command() {
    println!("I was invoked from JS!");
}

#[tauri::command]
fn command_with_message(message: String) -> String {
    format!("hello {}", message)
}

#[derive(Debug, Serialize, Deserialize)]
struct MyMessage {
    field_str: String,
    field_u32: u32,
}

#[tauri::command]
fn command_with_object(message: MyMessage) -> MyMessage {
    let MyMessage {
        field_str,
        field_u32,
    } = message;

    MyMessage {
        field_str: format!("hello {}", field_str),
        field_u32: field_u32 + 1,
    }
}

#[tauri::command]
fn command_with_error(arg: u32) -> Result<String, String> {
    if arg % 2 == 0 {
        Ok(format!("even value {}", arg))
    } else {
        Err(format!("odd value {}", arg))
    }
}

#[tauri::command]
async fn async_command(arg: u32) -> String {
    "hello".into()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            simple_command,
            command_with_message,
            command_with_object,
            command_with_error,
            async_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
